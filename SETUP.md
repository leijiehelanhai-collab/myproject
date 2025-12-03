# 安装和测试指南

## 前置要求

1. **Node.js 16+** - [下载地址](https://nodejs.org/)
2. **MetaMask浏览器扩展** - [安装地址](https://metamask.io/)
3. **BNB测试币** - 从[BSC测试网水龙头](https://testnet.binance.org/faucet-smart)获取

## 第一步：安装依赖

### 前端依赖
```bash
npm install
```

### Hardhat依赖（用于智能合约测试和部署）
```bash
# 安装Hardhat工具
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
```

## 第二步：编译智能合约

```bash
npx hardhat compile
```

## 第三步：测试智能合约

运行完整的测试套件：

```bash
npx hardhat test
```

这将测试：
- 合约部署
- 开启新一轮游戏
- 玩家加入游戏
- 唯一数字分配
- BNB分配逻辑
- 代币销毁机制
- 游戏结算

## 第四步：本地测试

### 方法A：使用Hardhat本地网络

1. 启动本地区块链节点：
```bash
npx hardhat node
```

2. 在新终端窗口部署合约：
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. 保存输出的合约地址

4. 启动前端：
```bash
npm start
```

5. 在浏览器中打开 http://localhost:3000

6. 配置MetaMask连接到 `http://localhost:8545`（Chain ID: 1337）

7. 导入Hardhat提供的测试账户私钥到MetaMask

### 方法B：使用BSC测试网

1. 配置环境变量：
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑.env文件，填入你的私钥和配置
```

2. 部署到BSC测试网：
```bash
npx hardhat run scripts/deploy.js --network bscTestnet
```

3. 保存合约地址

4. 启动前端并在浏览器中打开

5. 在MetaMask中切换到BSC测试网

## 第五步：使用管理员面板

1. 用浏览器打开 `scripts/admin-panel.html`

2. 按照以下步骤操作：
   - 连接MetaMask钱包
   - 设置游戏合约地址（从部署输出中获取）
   - （可选）部署测试代币
   - 开启新一轮游戏

3. 配置游戏参数：
   - **燃料代币地址**：测试代币地址或其他ERC20代币
   - **销毁数量**：玩家需要销毁的代币数量（如1000）
   - **门票价格**：BNB价格（如0.01）
   - **持续时间**：游戏时长（如4小时）

## 第六步：测试游戏流程

1. 确保你有多个测试账户（至少2-3个）

2. 每个账户需要：
   - 足够的BNB支付门票
   - 足够的燃料代币用于销毁

3. 使用不同账户加入游戏

4. 观察：
   - 每个玩家获得唯一的号码
   - 奖池累积
   - 代币被销毁到黑洞地址
   - 倒计时

5. 等待游戏结束（满员或超时）

6. 验证：
   - 最大号码持有者收到奖池
   - 游戏状态标记为已结算

## 常见问题

### Q: 交易失败 "Incorrect ticket price"
A: 确保你支付的BNB金额与合约设置的门票价格完全一致

### Q: 交易失败 "Token burn failed"  
A: 需要先授权合约使用你的代币。在前端会自动处理，但如果手动测试需要先调用`approve`

### Q: 无法连接到本地网络
A: 确保Hardhat节点正在运行，并在MetaMask中添加了正确的网络配置

### Q: Gas费用太高
A: 在测试网上可以增加gas limit，或等待网络不拥堵时再试

## 验证合约（可选）

部署到测试网后，可以在BSCScan上验证合约：

```bash
npx hardhat verify --network bscTestnet <合约地址> <开发者钱包地址>
```

## 安全提醒

⚠️ **重要**：
- 不要将`.env`文件提交到代码库
- 不要在主网使用测试私钥
- 在主网部署前进行充分测试
- 建议进行专业的安全审计

## 下一步

- 部署到BSC主网
- 添加前端UI优化
- 实现事件监听和实时更新
- 添加更多游戏功能

## 技术支持

如遇到问题，请检查：
1. 控制台日志
2. MetaMask交易记录
3. BSCScan交易详情
