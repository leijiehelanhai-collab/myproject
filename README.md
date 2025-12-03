# BNB链通用焚化炉 - 幸运翻牌版

一个创新的链上游戏，结合了代币销毁机制和幸运翻牌玩法。

🚀 **已准备好部署到BSC主网！**

## 🎮 游戏特点

- **限量参与**：每轮最多20个参与名额
- **唯一数字**：系统随机分配1-20的不重复数字
- **赢家通吃**：持有最大数字的玩家赢走奖池所有BNB
- **销毁机制**：玩家必须销毁指定的燃料代币作为门票

## 🚀 快速开始

### 前置要求

- Node.js 16+ 
- MetaMask 浏览器扩展
- BNB测试网/主网账户

### 安装依赖

```bash
npm install
```

### 启动前端

```bash
npm start
```

前端将在 http://localhost:3000 启动

## 📦 智能合约

### 合约部署

**主网部署** （详细步骤见 [MAINNET_DEPLOY.md](./MAINNET_DEPLOY.md)）：

```bash
# 1. 配置.env文件
cp .env.example .env
# 编辑.env，填写PRIVATE_KEY和DEV_WALLET

# 2. 编译合约
npx hardhat compile

# 3. 部署到BSC主网
npx hardhat run scripts/deploy-mainnet.js --network bscMainnet

# 4. 验证合约
npx hardhat verify --network bscMainnet <合约地址> <开发者钱包>
```

**测试网部署**：

```bash
npx hardhat run scripts/deploy.js --network bscTestnet
```

### 合约功能

1. **startNewRound** - 管理员开启新一轮游戏
2. **joinRound** - 玩家参与游戏并翻牌
3. **settleRound** - 结算轮次（满员或超时后）
4. **getRoundInfo** - 查询轮次信息
5. **getPlayerNumber** - 查询玩家的卡牌号码

## 💰 经济模型

### 资金分配（单次入场）

- **燃料代币（如$DOGE）**: 100% → 黑洞地址销毁
- **BNB结算**:
  - 80% → 本轮奖池
  - 5% → 开发者手续费
  - 15% → 下一轮储备金

## 🎯 游戏流程

1. 管理员设置本轮燃料代币和倒计时
2. 玩家支付BNB和燃料代币参与
3. 系统随机分配唯一数字（1-20）
4. 满员或超时后自动结算
5. 最大数字持有者获得全部奖池

## 🔒 安全特性

- 唯一数字分配算法保证不重复
- 自动销毁机制确保代币通缩
- 结算逻辑防止作弊
- 应急提取功能保护资金安全

## 📝 合约地址

**BSC主网**: TBD  
**BSC测试网**: TBD

## 🛠 技术栈

- **智能合约**: Solidity ^0.8.19
- **前端**: React 18 + Web3.js
- **样式**: TailwindCSS
- **图标**: Lucide React
- **网络**: BNB Smart Chain

## 📄 许可证

MIT License

---

**警告**: 本项目仅供学习和娱乐使用，请谨慎参与链上博弈活动。
