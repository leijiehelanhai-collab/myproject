// 生产环境配置
// 部署后请修改这些值

export const CONFIG = {
  // 合约地址（部署后填写）
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS || '',
  
  // 网络配置
  NETWORK: {
    chainId: 56, // BSC主网
    chainName: 'BSC Mainnet',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    }
  },
  
  // 测试网配置（开发时使用）
  TESTNET: {
    chainId: 97,
    chainName: 'BSC Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    blockExplorer: 'https://testnet.bscscan.com',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18
    }
  }
};

// 导出当前环境配置
export const CURRENT_NETWORK = process.env.REACT_APP_ENV === 'testnet' 
  ? CONFIG.TESTNET 
  : CONFIG.NETWORK;
