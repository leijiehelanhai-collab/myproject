# BSC主网部署指南

## 📋 部署前准备清单

### 1. 环境配置

创建 `.env` 文件（复制 `.env.example`）：

```bash
# BSC主网RPC
BSC_MAINNET_URL=https://bsc-dataseed.binance.org

# 部署账户私钥（务必保密！）
PRIVATE_KEY=你的私钥

# BSCScan API密钥（用于验证合约）
BSCSCAN_API_KEY=你的BSCScan_API密钥

# 开发者钱包地址（接收2%手续费）
DEV_WALLET=你的开发者钱包地址
```

### 2. 获取必需资源

#### BSCScan API密钥
1. 访问 https://bscscan.com/
2. 注册账户并登录
3. 进入 API-KEYs 页面
4. 创建新的API密钥

#### 私钥
⚠️ **安全提醒**：
- 使用全新的钱包进行部署
- 永远不要提交私钥到代码库
- 部署后立即转移合约所有权到冷钱包

#### BNB余额
- 准备至少 **0.1 BNB** 用于部署gas费
- 检查余额：在MetaMask中切换到BSC主网

### 3. 代码审计（强烈建议）

在主网部署前：
- ✅ 完整测试所有功能
- ✅ 代码审计（可使用CertiK、PeckShield等）
- ✅ 安全检查（Slither、Mythril等工具）

## 🚀 部署步骤

### 步骤1：安装依赖

```bash
npm install
```

### 步骤2：编译合约

```bash
npx hardhat compile
```

确保编译成功，无警告和错误。

### 步骤3：配置环境变量

编辑 `.env` 文件，填写：
- `PRIVATE_KEY` - 你的部署账户私钥
- `DEV_WALLET` - 开发者钱包地址
- `BSCSCAN_API_KEY` - BSCScan API密钥

### 步骤4：执行部署

```bash
npx hardhat run scripts/deploy-mainnet.js --network bscMainnet
```

**部署过程**：
1. 显示部署账户和余额
2. 等待5秒确认（可按Ctrl+C取消）
3. 部署UniversalCardGame合约
4. 显示合约地址

**预计费用**：约0.02-0.05 BNB

### 步骤5：验证合约

部署成功后，验证合约源码：

```bash
npx hardhat verify --network bscMainnet <合约地址> <开发者钱包地址>
```

示例：
```bash
npx hardhat verify --network bscMainnet 0x1234...abcd 0x5678...efgh
```

验证成功后，可在BSCScan上看到源代码。

### 步骤6：更新前端配置

编辑 `src/config.js`（如果有）或直接在前端代码中更新：

```javascript
const CONTRACT_ADDRESS = "你的合约地址";
const NETWORK_ID = 56; // BSC主网
const RPC_URL = "https://bsc-dataseed.binance.org";
```

## 📱 前端部署

### 方法1：部署到Netlify/Vercel

1. 构建生产版本：
```bash
npm run build
```

2. 上传 `build` 文件夹到Netlify或Vercel

### 方法2：部署到IPFS（去中心化）

1. 安装IPFS工具
2. 构建并上传：
```bash
npm run build
ipfs add -r build
```

## ✅ 部署后检查

- [ ] 合约在BSCScan上可见：https://bscscan.com/address/你的合约地址
- [ ] 合约源码已验证
- [ ] 前端可以连接到合约
- [ ] 测试开启一轮游戏（小金额）
- [ ] 测试玩家参与游戏
- [ ] 测试游戏结算
- [ ] 检查2%手续费是否正确发送到开发者钱包

## 🎮 开启第一轮游戏

### 准备工作

1. **准备燃料代币**：
   - 选择一个知名的BEP20代币（如USDT、BUSD等）
   - 或部署自己的代币合约

2. **参数设置**：
   - **销毁数量**：根据代币价值设定（建议100-1000）
   - **门票价格**：建议0.01-0.1 BNB
   - **持续时间**：建议12-24小时

### 使用前端开启

1. 访问你的前端应用
2. 连接MetaMask（切换到BSC主网）
3. 使用管理员账户登录
4. 切换到管理员模式
5. 填写参数并开启游戏

## 🔒 安全建议

1. **合约权限管理**：
   - 部署后将管理员权限转移到多签钱包
   - 使用Gnosis Safe等多签方案

2. **资金安全**：
   - 定期提取手续费到冷钱包
   - 不要在热钱包存储大额资金

3. **监控和维护**：
   - 监控合约事件
   - 设置异常告警
   - 准备紧急暂停机制

## 📞 支持与更新

遇到问题？
1. 检查BSCScan上的交易状态
2. 查看浏览器控制台错误
3. 确认MetaMask网络设置正确
4. 确认合约地址配置正确

## 📄 合约信息模板

部署成功后，保存以下信息：

```
合约名称：BNB链通用焚化炉 - 幸运翻牌版
合约地址：0x...
网络：BSC主网 (Chain ID: 56)
部署者：0x...
部署区块：#...
部署时间：2024-xx-xx
BSCScan：https://bscscan.com/address/0x...
前端地址：https://...
开发者钱包：0x...
```

---

**免责声明**：部署到主网涉及真实资金，请确保充分测试和审计。开发者不对任何损失负责。
