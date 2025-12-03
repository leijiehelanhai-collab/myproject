# 🧪 BSC测试网部署指南

## 为什么先用测试网？

- ✅ **免费测试**：使用免费的测试BNB
- ✅ **安全验证**：确保所有功能正常
- ✅ **无风险**：不涉及真实资金
- ✅ **快速迭代**：发现问题可快速修复重新部署

## 📋 快速开始（3步）

### 步骤1：获取测试BNB（2分钟）

**官方水龙头**（推荐）：
1. 访问：https://testnet.bnbchain.org/faucet-smart
2. 输入你的钱包地址
3. 完成验证
4. 等待1-2分钟收到 **0.5 tBNB**

**备用水龙头**：
- https://www.bnbchain.org/en/testnet-faucet
- https://faucet.quicknode.com/binance-smart-chain/bnb-testnet

**你的钱包地址**：
```
0x1f0F7d278088149B8f7A7e2313Bde06F504EDea3
```

### 步骤2：部署合约（1分钟）

```bash
# 部署到BSC测试网
npx hardhat run scripts/deploy.js --network bscTestnet
```

成功后会显示：
```
✅ 合约部署成功！
游戏合约地址: 0x...
测试代币地址: 0x...
```

### 步骤3：验证合约（可选）

```bash
npx hardhat verify --network bscTestnet <合约地址> <开发者钱包>
```

## 🎮 测试流程

### 1. 配置前端连接测试网

编辑 `src/config.js`：

```javascript
// 临时使用测试网
export const CURRENT_NETWORK = CONFIG.TESTNET;
```

或创建 `.env.local`：
```bash
REACT_APP_ENV=testnet
REACT_APP_CONTRACT_ADDRESS=你的测试网合约地址
```

### 2. 在前端测试

启动前端：
```bash
npm start
```

测试清单：
- [ ] MetaMask连接测试网
- [ ] 读取合约信息
- [ ] 管理员开启游戏
- [ ] 玩家参与游戏
- [ ] 代币销毁功能
- [ ] 游戏结算
- [ ] 手续费发送

### 3. 查看测试网交易

在BSC测试网浏览器查看：
- 合约：https://testnet.bscscan.com/address/你的合约地址
- 交易记录
- 事件日志
- 代币余额变化

## 🔄 迁移到主网

测试通过后，迁移到主网：

### 方案1：使用相同代码

```bash
# 1. 准备主网BNB（至少0.1个）
# 2. 部署到主网
npx hardhat run scripts/deploy-mainnet.js --network bscMainnet

# 3. 验证合约
npx hardhat verify --network bscMainnet <合约地址> <开发者钱包>

# 4. 更新前端配置
# 修改 src/config.js 使用主网配置
```

### 方案2：使用已有部署脚本

所有配置已准备好，只需：
1. 确保钱包有足够BNB（0.1+）
2. 运行主网部署命令
3. 更新前端合约地址

## 📝 测试网 vs 主网对比

| 项目 | 测试网 | 主网 |
|------|--------|------|
| **费用** | 免费tBNB | 真实BNB |
| **RPC** | testnet-dataseed | dataseed |
| **Chain ID** | 97 | 56 |
| **浏览器** | testnet.bscscan.com | bscscan.com |
| **风险** | 零风险 | 需谨慎 |
| **验证** | 可选 | 强烈推荐 |

## 🐛 常见问题

**Q: 测试BNB不够怎么办？**
A: 24小时后可再次领取，或使用多个水龙头

**Q: 测试网交易很慢？**
A: 测试网可能不稳定，耐心等待或重试

**Q: 如何重置测试？**
A: 直接重新部署即可，测试网合约可以随意部署

**Q: 测试网合约可以用到主网吗？**
A: 不行，需要在主网重新部署

## ✅ 测试完成检查清单

部署到主网前确认：
- [ ] 所有合约功能正常
- [ ] 前端UI显示正确
- [ ] 代币销毁成功
- [ ] 游戏结算正确
- [ ] 手续费计算准确
- [ ] 无安全漏洞
- [ ] 用户体验良好

## 🚀 准备好了？

测试通过后，按照 `MAINNET_DEPLOY.md` 部署到主网！

---

**记住**：测试网是你的游乐场，大胆测试！主网才需要谨慎。
