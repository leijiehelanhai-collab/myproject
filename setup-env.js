// 自动配置.env文件
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

console.log('🔧 配置部署环境...\n');

// 读取.env.example
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ 找到现有的.env文件');
} else if (fs.existsSync(envExamplePath)) {
  envContent = fs.readFileSync(envExamplePath, 'utf8');
  console.log('📋 从.env.example创建新的.env文件');
} else {
  envContent = `# BSC网络配置
BSC_TESTNET_URL=https://bsc-testnet-dataseed.bnbchain.org
BSC_MAINNET_URL=https://bsc-dataseed2.defibit.io

# 私钥（不要提交到代码库！）
PRIVATE_KEY=

# BSCScan API密钥（用于验证合约）
BSCSCAN_API_KEY=

# 开发者钱包地址
DEV_WALLET=

# 合约地址（部署后填写）
CONTRACT_ADDRESS=
`;
  console.log('📝 创建新的.env文件');
}

// 更新RPC URLs为测试后最快的节点
envContent = envContent.replace(
  /BSC_TESTNET_URL=.*/,
  'BSC_TESTNET_URL=https://bsc-testnet-dataseed.bnbchain.org'
);
envContent = envContent.replace(
  /BSC_MAINNET_URL=.*/,
  'BSC_MAINNET_URL=https://bsc-dataseed2.defibit.io'
);

// 保存
fs.writeFileSync(envPath, envContent);

console.log('\n✅ .env文件已更新！');
console.log('\n📝 请手动编辑.env文件，填写以下信息：');
console.log('   - PRIVATE_KEY（你的钱包私钥，不含0x）');
console.log('   - DEV_WALLET（你的开发者钱包地址）');
console.log('\n💡 提示：');
console.log('   1. 从MetaMask导出私钥');
console.log('   2. 去掉开头的"0x"');
console.log('   3. 粘贴到PRIVATE_KEY=后面');
console.log('\n⚠️  重要：永远不要将.env文件提交到代码库！');
console.log('\n🎯 配置完成后，运行：');
console.log('   npx hardhat run scripts/deploy.js --network bscTestnet');
