// BSC主网部署脚本
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 开始部署到BSC主网...\n");
  console.log("⚠️  警告：这将在主网上部署合约，需要真实的BNB作为gas费！\n");

  // 等待5秒让用户确认
  console.log("5秒后开始部署，按Ctrl+C取消...");
  await new Promise(resolve => setTimeout(resolve, 5000));

  const [deployer] = await hre.ethers.getSigners();
  console.log("部署账户:", deployer.address);

  // 检查余额
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("账户余额:", hre.ethers.formatEther(balance), "BNB");

  if (balance < hre.ethers.parseEther("0.00001")) {
    console.error("❌ 错误：余额不足！至少需要0.05 BNB用于部署");
    process.exit(1);
  }

  // 获取开发者钱包地址
  const devWallet = process.env.DEV_WALLET || deployer.address;
  console.log("开发者钱包:", devWallet);
  console.log("\n📝 开始部署UniversalCardGame合约...");

  // 部署游戏合约
  const UniversalCardGame = await hre.ethers.getContractFactory("UniversalCardGame");
  const game = await UniversalCardGame.deploy(devWallet);
  await game.waitForDeployment();
  const gameAddress = await game.getAddress();

  console.log("\n✅ 合约部署成功！");
  console.log("=".repeat(60));
  console.log("游戏合约地址:", gameAddress);
  console.log("开发者钱包:", devWallet);
  console.log("=".repeat(60));

  console.log("\n📋 下一步操作：");
  console.log("1. 保存合约地址到.env文件");
  console.log("2. 验证合约：npx hardhat verify --network bscMainnet", gameAddress, devWallet);
  console.log("3. 更新前端配置文件中的合约地址");
  console.log("4. 在BSCScan上查看：https://bscscan.com/address/" + gameAddress);
  
  console.log("\n⚠️  重要提醒：");
  console.log("- 合约部署后无法修改，请确保代码经过充分测试");
  console.log("- 开启游戏前需要准备足够的代币用于销毁");
  console.log("- 建议先在测试网测试所有功能");
  console.log("- 确保开发者钱包安全");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
