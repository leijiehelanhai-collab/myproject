const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("UniversalCardGame", function () {
  let game;
  let mockToken;
  let owner;
  let devWallet;
  let player1;
  let player2;
  let player3;

  const BURN_AMOUNT = ethers.parseEther("1000");
  const TICKET_PRICE = ethers.parseEther("0.01");
  const DURATION = 3600; // 1 hour

  beforeEach(async function () {
    [owner, devWallet, player1, player2, player3] = await ethers.getSigners();

    // 部署测试代币
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("TestToken", "TEST", 1000000);
    await mockToken.waitForDeployment();

    // 部署游戏合约
    const UniversalCardGame = await ethers.getContractFactory("UniversalCardGame");
    game = await UniversalCardGame.deploy(devWallet.address);
    await game.waitForDeployment();

    // 给玩家分配代币
    await mockToken.mint(player1.address, ethers.parseEther("10000"));
    await mockToken.mint(player2.address, ethers.parseEther("10000"));
    await mockToken.mint(player3.address, ethers.parseEther("10000"));
  });

  describe("部署", function () {
    it("应该正确设置owner和devWallet", async function () {
      expect(await game.owner()).to.equal(owner.address);
      expect(await game.devWallet()).to.equal(devWallet.address);
    });

    it("应该初始化currentRoundId为0", async function () {
      expect(await game.currentRoundId()).to.equal(0);
    });
  });

  describe("开启新一轮", function () {
    it("应该成功开启新一轮游戏", async function () {
      await expect(
        game.startNewRound(
          await mockToken.getAddress(),
          BURN_AMOUNT,
          TICKET_PRICE,
          DURATION
        )
      ).to.emit(game, "RoundStarted");

      expect(await game.currentRoundId()).to.equal(1);
      
      const roundInfo = await game.getRoundInfo(1);
      expect(roundInfo.tokenAddress).to.equal(await mockToken.getAddress());
      expect(roundInfo.burnAmount).to.equal(BURN_AMOUNT);
      expect(roundInfo.ticketPrice).to.equal(TICKET_PRICE);
    });

    it("非owner不能开启新一轮", async function () {
      await expect(
        game.connect(player1).startNewRound(
          await mockToken.getAddress(),
          BURN_AMOUNT,
          TICKET_PRICE,
          DURATION
        )
      ).to.be.revertedWith("Not owner");
    });

    it("应该初始化20个可用数字", async function () {
      await game.startNewRound(
        await mockToken.getAddress(),
        BURN_AMOUNT,
        TICKET_PRICE,
        DURATION
      );

      const availableNumbers = await game.getAvailableNumbers(1);
      expect(availableNumbers.length).to.equal(20);
    });
  });

  describe("加入游戏", function () {
    beforeEach(async function () {
      await game.startNewRound(
        await mockToken.getAddress(),
        BURN_AMOUNT,
        TICKET_PRICE,
        DURATION
      );

      // 授权代币
      await mockToken.connect(player1).approve(await game.getAddress(), BURN_AMOUNT);
    });

    it("应该成功加入游戏并分配唯一数字", async function () {
      const tx = await game.connect(player1).joinRound({ value: TICKET_PRICE });
      const receipt = await tx.wait();

      // 检查事件
      const event = receipt.logs.find(log => {
        try {
          return game.interface.parseLog(log).name === "PlayerJoined";
        } catch {
          return false;
        }
      });

      expect(event).to.not.be.undefined;

      // 检查玩家获得了数字
      const playerNumber = await game.getPlayerNumber(1, player1.address);
      expect(playerNumber).to.be.within(1, 20);
    });

    it("支付的BNB不正确时应该失败", async function () {
      await expect(
        game.connect(player1).joinRound({ value: ethers.parseEther("0.02") })
      ).to.be.revertedWith("Incorrect ticket price");
    });

    it("同一玩家不能加入两次", async function () {
      await game.connect(player1).joinRound({ value: TICKET_PRICE });

      await mockToken.connect(player1).approve(await game.getAddress(), BURN_AMOUNT);

      await expect(
        game.connect(player1).joinRound({ value: TICKET_PRICE })
      ).to.be.revertedWith("Already joined this round");
    });

    it("应该正确分配BNB", async function () {
      const devBalanceBefore = await ethers.provider.getBalance(devWallet.address);

      await game.connect(player1).joinRound({ value: TICKET_PRICE });

      const devBalanceAfter = await ethers.provider.getBalance(devWallet.address);
      const devFee = TICKET_PRICE * 50n / 1000n; // 5%

      expect(devBalanceAfter - devBalanceBefore).to.equal(devFee);
    });

    it("应该销毁燃料代币", async function () {
      const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";
      const deadBalanceBefore = await mockToken.balanceOf(DEAD_ADDRESS);

      await game.connect(player1).joinRound({ value: TICKET_PRICE });

      const deadBalanceAfter = await mockToken.balanceOf(DEAD_ADDRESS);
      expect(deadBalanceAfter - deadBalanceBefore).to.equal(BURN_AMOUNT);
    });
  });

  describe("结算", function () {
    beforeEach(async function () {
      await game.startNewRound(
        await mockToken.getAddress(),
        BURN_AMOUNT,
        TICKET_PRICE,
        DURATION
      );

      // 多个玩家加入
      await mockToken.connect(player1).approve(await game.getAddress(), BURN_AMOUNT);
      await game.connect(player1).joinRound({ value: TICKET_PRICE });

      await mockToken.connect(player2).approve(await game.getAddress(), BURN_AMOUNT);
      await game.connect(player2).joinRound({ value: TICKET_PRICE });

      await mockToken.connect(player3).approve(await game.getAddress(), BURN_AMOUNT);
      await game.connect(player3).joinRound({ value: TICKET_PRICE });
    });

    it("超时后应该可以手动结算", async function () {
      // 增加时间超过游戏持续时间
      await time.increase(DURATION + 1);

      const roundInfo = await game.getRoundInfo(1);
      const winner = roundInfo.maxNumberHolder;

      await expect(game.settleRound(1))
        .to.emit(game, "RoundSettled")
        .withArgs(1, winner, roundInfo.currentPot, roundInfo.maxNumber);
    });

    it("未超时且未满员时不能结算", async function () {
      await expect(game.settleRound(1)).to.be.revertedWith("Cannot settle yet");
    });

    it("赢家应该收到奖池", async function () {
      await time.increase(DURATION + 1);

      const roundInfo = await game.getRoundInfo(1);
      const winner = roundInfo.maxNumberHolder;
      const winnerBalanceBefore = await ethers.provider.getBalance(winner);

      await game.settleRound(1);

      const winnerBalanceAfter = await ethers.provider.getBalance(winner);
      const expectedPrize = TICKET_PRICE * 3n * 800n / 1000n; // 80% of 3 tickets

      expect(winnerBalanceAfter - winnerBalanceBefore).to.equal(expectedPrize);
    });

    it("结算后不能再次结算", async function () {
      await time.increase(DURATION + 1);
      await game.settleRound(1);

      await expect(game.settleRound(1)).to.be.revertedWith("Round already settled");
    });
  });

  describe("查询函数", function () {
    beforeEach(async function () {
      await game.startNewRound(
        await mockToken.getAddress(),
        BURN_AMOUNT,
        TICKET_PRICE,
        DURATION
      );
    });

    it("应该正确返回轮次信息", async function () {
      const roundInfo = await game.getRoundInfo(1);

      expect(roundInfo.tokenAddress).to.equal(await mockToken.getAddress());
      expect(roundInfo.burnAmount).to.equal(BURN_AMOUNT);
      expect(roundInfo.ticketPrice).to.equal(TICKET_PRICE);
      expect(roundInfo.participantCount).to.equal(0);
      expect(roundInfo.isSettled).to.equal(false);
    });

    it("应该正确返回参与者列表", async function () {
      await mockToken.connect(player1).approve(await game.getAddress(), BURN_AMOUNT);
      await game.connect(player1).joinRound({ value: TICKET_PRICE });

      const participants = await game.getRoundParticipants(1);
      expect(participants.length).to.equal(1);
      expect(participants[0]).to.equal(player1.address);
    });
  });
});
