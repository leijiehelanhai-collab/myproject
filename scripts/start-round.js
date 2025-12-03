const hre = require("hardhat");

async function main() {
  // 从命令行参数获取合约地址
  const contractAddress = process.env.CONTRACT_ADDRESS || process.argv[2];
  
  if (!contractAddress) {
    console.error("请提供合约地址: node scripts/start-round.js <CONTRACT_ADDRESS>");
    process.exit(1);
  }

  console.log("连接到合约:", contractAddress);

  // 连接到已部署的合约
  const UniversalCardGame = await hre.ethers.getContractFactory("UniversalCardGame");
  const game = UniversalCardGame.attach(contractAddress);

  // 配置新一轮游戏的参数
  const tokenAddress = process.env.TOKEN_ADDRESS || "0x0000000000000000000000000000000000000001"; // 替换为实际的ERC20代币地址
  const burnAmount = hre.ethers.parseEther("1000"); // 需要销毁的代币数量
  const ticketPrice = hre.ethers.parseEther("0.01"); // 0.01 BNB门票价格
  const duration = 4 * 60 * 60; // 4小时（秒）

  console.log("\n游戏配置:");
  console.log("- 燃料代币地址:", tokenAddress);
  console.log("- 销毁数量:", hre.ethers.formatEther(burnAmount), "代币");
  console.log("- 门票价格:", hre.ethers.formatEther(ticketPrice), "BNB");
  console.log("- 持续时间:", duration / 3600, "小时");

  console.log("\n开启新一轮游戏...");
  
  try {
    const tx = await game.startNewRound(
      tokenAddress,
      burnAmount,
      ticketPrice,
      duration
    );

    console.log("交易已发送:", tx.hash);
    console.log("等待确认...");

    const receipt = await tx.wait();
    console.log("✅ 新一轮游戏已开启！");
    console.log("Gas 使用:", receipt.gasUsed.toString());

    // 获取当前轮次ID
    const currentRoundId = await game.currentRoundId();
    console.log("\n当前轮次 ID:", currentRoundId.toString());

  } catch (error) {
    console.error("❌ 开启游戏失败:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
