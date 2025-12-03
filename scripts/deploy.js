// 部署BNB链通用焚化炉游戏合约 (多轮版)
const hre = require("hardhat");

async function main() {
  console.log("🚀 开始部署UniversalCardGame合约...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("部署账户:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("账户余额:", hre.ethers.formatEther(balance), "BNB\n");

  // 获取开发者钱包地址
  const devWallet = process.env.DEV_WALLET || deployer.address;
  console.log("开发者钱包:", devWallet);

  // 部署游戏合约
  console.log("📝 部署UniversalCardGame合约...");
  const UniversalCardGame = await hre.ethers.getContractFactory("UniversalCardGame");
  const game = await UniversalCardGame.deploy(devWallet);

  await game.waitForDeployment();
  const gameAddress = await game.getAddress();

  console.log("\n✅ UniversalCardGame合约部署成功！");
  console.log("=".repeat(70));
  console.log("合约地址:", gameAddress);
  console.log("开发者钱包:", devWallet);
  console.log("支持功能:");
  console.log("  ✅ 多轮同时进行");
  console.log("  ✅ 每轮独立管理");
  console.log("  ✅ 玩家可参与多轮");
  console.log("  ✅ 查询所有活跃轮次");
  console.log("=".repeat(70));

  console.log("\n📋 新功能说明：");
  console.log("1. 管理员可以同时开启多个游戏轮次");
  console.log("2. 每个轮次独立运行，互不影响");
  console.log("3. 玩家可以同时参与多个轮次");
  console.log("4. 前端可以显示所有活跃轮次列表");

  console.log("\n🎮 使用方法：");
  console.log("1. startNewRound() - 开启新轮次");
  console.log("2. joinRound(roundId) - 参与指定轮次");
  console.log("3. getActiveRounds() - 查询所有活跃轮次");
  console.log("4. getRoundInfo(roundId) - 查询轮次详情");

  console.log("\n等待区块确认...");
  await game.deploymentTransaction().wait(3);

  console.log("\n验证合约命令:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${gameAddress} ${devWallet}`);
  
  console.log("\n🔍 在BSC测试网浏览器查看：");
  console.log(`https://testnet.bscscan.com/address/${gameAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
