// 测试BSC测试网RPC连接速度
const https = require('https');

const TESTNET_RPC_URLS = [
  'https://bsc-testnet-dataseed.bnbchain.org',
  'https://data-seed-prebsc-1-s1.binance.org:8545',
  'https://data-seed-prebsc-2-s1.binance.org:8545',
  'https://data-seed-prebsc-1-s2.binance.org:8545',
  'https://data-seed-prebsc-2-s2.binance.org:8545',
  'https://data-seed-prebsc-1-s3.binance.org:8545',
  'https://data-seed-prebsc-2-s3.binance.org:8545',
  'https://bsc-testnet.publicnode.com',
  'https://bsc-testnet-rpc.publicnode.com',
];

async function testRPC(url) {
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 1
    });

    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        try {
          const result = JSON.parse(data);
          if (result.result) {
            resolve({ url, success: true, time: responseTime, block: parseInt(result.result, 16) });
          } else {
            resolve({ url, success: false, time: responseTime, error: 'Invalid response' });
          }
        } catch (e) {
          resolve({ url, success: false, time: responseTime, error: e.message });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ url, success: false, time: Date.now() - startTime, error: e.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ url, success: false, time: 10000, error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🔍 测试BSC测试网RPC节点速度...\n');
  
  const results = [];
  for (const url of TESTNET_RPC_URLS) {
    process.stdout.write(`测试 ${url}... `);
    const result = await testRPC(url);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${result.time}ms (区块: ${result.block})`);
    } else {
      console.log(`❌ 失败: ${result.error}`);
    }
  }

  // 按速度排序
  const successful = results.filter(r => r.success).sort((a, b) => a.time - b.time);
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 可用的BSC测试网RPC节点（按速度排序）：');
  console.log('='.repeat(70));
  
  if (successful.length > 0) {
    successful.forEach((r, i) => {
      console.log(`${i + 1}. ${r.url} (${r.time}ms)`);
    });

    console.log('\n💡 建议在 hardhat.config.js 中设置：');
    console.log(`url: "${successful[0].url}"`);
    
    console.log('\n或在 .env 中设置：');
    console.log(`BSC_TESTNET_URL=${successful[0].url}`);
  } else {
    console.log('\n❌ 所有测试网RPC节点都无法连接！');
    console.log('\n可能的原因：');
    console.log('1. 网络被墙，需要使用VPN');
    console.log('2. 防火墙阻止了连接');
    console.log('3. BSC测试网维护中');
    console.log('\n建议：');
    console.log('- 尝试使用VPN');
    console.log('- 检查防火墙设置');
    console.log('- 稍后再试');
  }
}

main().catch(console.error);
