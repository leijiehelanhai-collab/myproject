// 部署测试代币到BSC测试网
const hre = require("hardhat");

async function main() {
  console.log("🪙 开始部署测试代币...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("部署账户:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("账户余额:", hre.ethers.formatEther(balance), "BNB\n");

  // 部署MockERC20测试代币
  console.log("📝 部署MockERC20代币...");
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  
  // 参数：名称、符号、初始供应量（单位：个，会自动转换为wei）
  const token = await MockERC20.deploy(
    "Test Token",           // 代币名称
    "TEST",                 // 代币符号
    1000000                 // 初始供应量：100万个
  );

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  console.log("\n✅ 测试代币部署成功！");
  console.log("=".repeat(60));
  console.log("代币地址:", tokenAddress);
  console.log("代币名称: Test Token");
  console.log("代币符号: TEST");
  console.log("初始供应: 1,000,000 TEST");
  console.log("部署者余额:", hre.ethers.formatEther(await token.balanceOf(deployer.address)), "TEST");
  console.log("=".repeat(60));

  console.log("\n📋 下一步操作：");
  console.log("1. 保存代币地址:", tokenAddress);
  console.log("2. 在前端管理员模式中使用此地址开启游戏");
  console.log("3. 如需给其他账户分配代币，在Remix或Hardhat控制台操作");
  
  console.log("\n💡 给测试账户分配代币的方法：");
  console.log("   在Hardhat控制台运行：");
  console.log("   const token = await ethers.getContractAt('MockERC20', '" + tokenAddress + "');");
  console.log("   await token.mint('玩家地址', ethers.parseEther('10000'));");

  console.log("\n🔍 在BSC测试网浏览器查看：");
  console.log("   https://testnet.bscscan.com/address/" + tokenAddress);

  // 等待确认
  console.log("\n等待区块确认...");
  await token.deploymentTransaction().wait(3);

  console.log("\n验证合约命令:");
  console.log(`npx hardhat verify --network bscTestnet ${tokenAddress} "Test Token" "TEST" 1000000`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
