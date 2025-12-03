// 测试BSC主网RPC连接速度
const https = require('https');

const RPC_URLS = [
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
  'https://bsc-dataseed4.binance.org',
  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed2.defibit.io',
  'https://bsc-dataseed3.defibit.io',
  'https://bsc-dataseed4.defibit.io',
  'https://bsc-dataseed1.ninicoin.io',
  'https://bsc-dataseed2.ninicoin.io',
  'https://rpc.ankr.com/bsc',
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
      timeout: 5000
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
      resolve({ url, success: false, time: 5000, error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🔍 测试BSC主网RPC节点速度...\n');
  
  const results = [];
  for (const url of RPC_URLS) {
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
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 推荐使用的RPC节点（按速度排序）：');
  console.log('='.repeat(60));
  
  successful.slice(0, 5).forEach((r, i) => {
    console.log(`${i + 1}. ${r.url} (${r.time}ms)`);
  });

  if (successful.length > 0) {
    console.log('\n💡 建议在.env中设置：');
    console.log(`BSC_MAINNET_URL=${successful[0].url}`);
  } else {
    console.log('\n❌ 所有RPC节点都无法连接！请检查网络或使用VPN。');
  }
}

main().catch(console.error);
