require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// 配置HTTP超时
const HTTP_TIMEOUT = 120000; // 120秒

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    bscTestnet: {
      url: process.env.BSC_TESTNET_URL || "https://bsc-testnet-dataseed.bnbchain.org",
      chainId: 97,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000,
      timeout: HTTP_TIMEOUT,
      httpHeaders: {
        "User-Agent": "hardhat"
      }
    },
    bscMainnet: {
      url: process.env.BSC_MAINNET_URL || "https://bsc-dataseed2.defibit.io",
      chainId: 56,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 5000000000,
      timeout: HTTP_TIMEOUT,
      httpHeaders: {
        "User-Agent": "hardhat"
      }
    }
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || ""
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
