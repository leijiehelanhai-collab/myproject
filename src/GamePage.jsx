import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import { useLanguage } from './contexts/LanguageContext';
import './App.css';

// BNB链焚化炉游戏合约ABI（代币分组版，只包含需要的函数）
const GAME_ABI = [
  {
    "inputs": [{ "name": "_tokenAddress", "type": "address" }, { "name": "_burnAmount", "type": "uint256" }, { "name": "_ticketPrice", "type": "uint256" }, { "name": "_duration", "type": "uint256" }],
    "name": "startNewRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_roundId", "type": "uint256" }],
    "name": "joinRound",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_roundId", "type": "uint256" }],
    "name": "getRoundInfo",
    "outputs": [
      { "name": "roundId", "type": "uint256" },
      { "name": "tokenAddress", "type": "address" },
      { "name": "burnAmount", "type": "uint256" },
      { "name": "ticketPrice", "type": "uint256" },
      { "name": "startTime", "type": "uint256" },
      { "name": "endTime", "type": "uint256" },
      { "name": "participantCount", "type": "uint256" },
      { "name": "currentPot", "type": "uint256" },
      { "name": "maxNumber", "type": "uint256" },
      { "name": "maxNumberHolder", "type": "address" },
      { "name": "isSettled", "type": "bool" },
      { "name": "isActive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_roundId", "type": "uint256" }],
    "name": "getRoundExtendedInfo",
    "outputs": [
      { "name": "inheritedReserve", "type": "uint256" },
      { "name": "tokenName", "type": "string" },
      { "name": "tokenSymbol", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveRounds",
    "outputs": [{ "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_roundId", "type": "uint256" }, { "name": "_player", "type": "address" }],
    "name": "getPlayerNumber",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_player", "type": "address" }],
    "name": "getPlayerActiveRounds",
    "outputs": [{ "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRoundsCreated",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "tokenAddress", "type": "address" }],
    "name": "canStartNewRound",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "tokenAddress", "type": "address" }],
    "name": "getTokenReserveInfo",
    "outputs": [
      { "name": "reservePool", "type": "uint256" },
      { "name": "activeRoundId", "type": "uint256" },
      { "name": "totalRounds", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_roundId", "type": "uint256" }],
    "name": "settleRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ERC20 ABI
const ERC20_ABI = [
  {
    "inputs": [{ "name": "spender", "type": "address" }, { "name": "amount", "type": "uint256" }],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  }
];

function GamePage({ account: globalAccount }) {
  const { t } = useLanguage();

  // 基础状态
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState(process.env.REACT_APP_CONTRACT_ADDRESS || '');
  const [inputContractAddress, setInputContractAddress] = useState('');
  const [contractOwner, setContractOwner] = useState('');

  // UI状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  // 每个轮次的独立loading状态
  const [roundLoadingStates, setRoundLoadingStates] = useState({});

  // 多轮游戏状态
  const [activeRounds, setActiveRounds] = useState([]);
  const [myActiveRounds, setMyActiveRounds] = useState([]);
  const [totalRounds, setTotalRounds] = useState(0);

  // 管理员状态
  const [adminTokenAddr, setAdminTokenAddr] = useState(process.env.REACT_APP_TEST_TOKEN_1 || '');
  const [adminBurnAmount, setAdminBurnAmount] = useState('100');
  const [adminTicketPrice, setAdminTicketPrice] = useState('0.01');
  const [adminDuration, setAdminDuration] = useState('0.5');

  // 代币管理状态
  const [tokenStatus, setTokenStatus] = useState(null);
  const [tokenReserves, setTokenReserves] = useState({});

  // 同步全局钱包状态
  useEffect(() => {
    if (globalAccount && globalAccount !== account) {
      setAccount(globalAccount);
      // 如果有全局账户但没有web3实例，重新设置web3
      if (!web3 && window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        // 如果有默认合约地址，自动设置合约
        if (contractAddress && !contract) {
          setTimeout(() => setupContract(contractAddress, web3Instance), 500);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalAccount, account, web3, contract, contractAddress]);

  // 获取代币名称（用于轮次显示）
  const getTokenName = useCallback(async (tokenAddress) => {
    if (tokenReserves[tokenAddress]) {
      return tokenReserves[tokenAddress];
    }

    try {
      const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
      const name = await tokenContract.methods.name().call();
      const symbol = await tokenContract.methods.symbol().call();

      const tokenInfo = { name, symbol };
      setTokenReserves(prev => ({ ...prev, [tokenAddress]: tokenInfo }));
      return tokenInfo;
    } catch (err) {
      const unknownInfo = { name: 'Unknown Token', symbol: 'UNKNOWN' };
      setTokenReserves(prev => ({ ...prev, [tokenAddress]: unknownInfo }));
      return unknownInfo;
    }
  }, [web3, tokenReserves]);

  // 加载活跃轮次
  const loadActiveRounds = useCallback(async (contractInstance = contract) => {
    if (!contractInstance) return;

    try {
      // 获取所有活跃轮次
      const activeRoundIds = await contractInstance.methods.getActiveRounds().call();

      // 获取总轮次数
      const total = await contractInstance.methods.totalRoundsCreated().call();
      setTotalRounds(Number(total));

      // 获取每个活跃轮次的详细信息
      const roundsData = [];
      for (const roundId of activeRoundIds) {
        try {
          const info = await contractInstance.methods.getRoundInfo(Number(roundId)).call();
          const extendedInfo = await contractInstance.methods.getRoundExtendedInfo(Number(roundId)).call();

          // 获取代币名称（fallback）
          const tokenInfo = await getTokenName(info.tokenAddress);

          roundsData.push({
            roundId: Number(roundId),
            tokenAddress: info.tokenAddress,
            tokenName: extendedInfo.tokenName || tokenInfo.name,
            tokenSymbol: extendedInfo.tokenSymbol || tokenInfo.symbol,
            burnAmount: info.burnAmount,
            ticketPrice: info.ticketPrice,
            startTime: Number(info.startTime),
            endTime: Number(info.endTime),
            participantCount: Number(info.participantCount),
            currentPot: info.currentPot,
            inheritedReserve: extendedInfo.inheritedReserve || '0',
            maxNumber: Number(info.maxNumber),
            maxNumberHolder: info.maxNumberHolder,
            isSettled: info.isSettled,
            isActive: info.isActive
          });
        } catch (err) {
          console.error(`加载轮次 ${roundId} 失败:`, err);
        }
      }

      // 过滤掉已过期且无人参与的轮次
      const currentTime = Math.floor(Date.now() / 1000);
      const validRounds = roundsData.filter(round => {
        // 如果轮次未过期，保留
        if (currentTime < round.endTime) {
          return true;
        }
        // 如果已过期但有人参与，保留（需要手动结算）
        if (round.participantCount > 0) {
          return true;
        }
        // 已过期且无人参与的轮次，不显示
        return false;
      });

      setActiveRounds(validRounds);

      // 如果用户已连接，获取他参与的轮次
      if (account) {
        const playerRounds = await contractInstance.methods.getPlayerActiveRounds(account).call();
        setMyActiveRounds(playerRounds.map(Number));
      }

    } catch (err) {
      console.error('加载活跃轮次失败:', err);
    }
  }, [contract, account, getTokenName]);

  // 设置合约
  const setupContract = useCallback(async (address = null, web3Instance = null) => {
    try {
      const useAddress = address || inputContractAddress.trim() || contractAddress;
      const useWeb3 = web3Instance || web3;

      if (!useWeb3 || !useAddress) {
        setError('请先连接钱包并设置合约地址');
        return;
      }

      if (!useWeb3.utils.isAddress(useAddress)) {
        setError('合约地址格式不正确');
        return;
      }

      const contractInstance = new useWeb3.eth.Contract(GAME_ABI, useAddress);
      setContract(contractInstance);
      setContractAddress(useAddress);

      if (address) {
        setSuccess(`✅ ${t('game.auto_connected')}`);
      } else {
        setSuccess(`✅ ${t('game.success.contract_set')}`);
      }

      // 获取合约所有者地址
      const ownerAddress = await contractInstance.methods.owner().call();
      setContractOwner(ownerAddress.toLowerCase());

      // 立即加载数据
      loadActiveRounds(contractInstance);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('设置合约失败:', err);
      setError('设置合约失败: ' + (err.message || '未知错误'));
    }
  }, [inputContractAddress, contractAddress, web3, t, loadActiveRounds]);

  // 连接钱包
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();

        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setSuccess('🎉 钱包连接成功！');

        // 如果有默认合约地址，自动设置合约
        if (contractAddress && !contract) {
          setTimeout(() => setupContract(contractAddress, web3Instance), 500);
        }

        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('❌ 请安装MetaMask钱包');
      }
    } catch (err) {
      console.error('连接钱包失败:', err);
      setError('连接失败: ' + (err.message || '未知错误'));
    }
  };

  // 检查是否为合约所有者
  const isContractOwner = () => {
    return account && contractOwner && account.toLowerCase() === contractOwner;
  };

  // 检查代币状态
  const checkTokenStatus = async (tokenAddress) => {
    if (!contract || !Web3.utils.isAddress(tokenAddress)) return null;

    try {
      const canStart = await contract.methods.canStartNewRound(tokenAddress).call();
      const reserveInfo = await contract.methods.getTokenReserveInfo(tokenAddress).call();

      // 获取代币名称
      let tokenName = 'Unknown Token';
      let tokenSymbol = 'UNKNOWN';

      try {
        const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
        tokenName = await tokenContract.methods.name().call();
        tokenSymbol = await tokenContract.methods.symbol().call();
      } catch (err) {
        console.log('无法获取代币信息:', err);
      }

      return {
        canStart,
        reservePool: Web3.utils.fromWei(reserveInfo.reservePool, 'ether'),
        activeRoundId: Number(reserveInfo.activeRoundId),
        totalRounds: Number(reserveInfo.totalRounds),
        tokenName,
        tokenSymbol
      };
    } catch (err) {
      console.error('检查代币状态失败:', err);
      return null;
    }
  };

  // 开启新轮次
  const startNewRound = async () => {
    if (!contract || !account || !adminTokenAddr) {
      setError('请设置合约并填写代币地址');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanTokenAddr = adminTokenAddr.trim();
      if (!web3.utils.isAddress(cleanTokenAddr)) {
        setError('代币地址格式不正确，请检查');
        setLoading(false);
        return;
      }

      // 检查代币是否可以开启新轮次
      const status = await checkTokenStatus(cleanTokenAddr);
      if (!status.canStart) {
        setError(`该代币已有活跃轮次 #${status.activeRoundId}，请等待结束后再开启新轮次`);
        setLoading(false);
        return;
      }

      const burnAmountWei = web3.utils.toWei(adminBurnAmount, 'ether');
      const ticketPriceWei = web3.utils.toWei(adminTicketPrice, 'ether');
      const durationSeconds = Math.floor(parseFloat(adminDuration) * 3600);

      setSuccess('正在开启新游戏...');

      await contract.methods
        .startNewRound(cleanTokenAddr, burnAmountWei, ticketPriceWei, durationSeconds)
        .send({ from: account });

      setSuccess('✅ 新一轮游戏已开启！');

      // 重新加载数据
      setTimeout(() => {
        loadActiveRounds();
        setSuccess('');
      }, 3000);

    } catch (err) {
      console.error('开启失败:', err);
      setError('开启失败: ' + (err.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 设置轮次loading状态
  const setRoundLoading = (roundId, isLoading) => {
    setRoundLoadingStates(prev => ({
      ...prev,
      [roundId]: isLoading
    }));
  };

  // 参与指定轮次
  const joinRound = async (roundId) => {
    if (!contract || !account) {
      setError('请先连接钱包');
      return;
    }

    const round = activeRounds.find(r => r.roundId === roundId);
    if (!round) {
      setError('轮次信息不存在');
      return;
    }

    setRoundLoading(roundId, true);
    setError('');

    try {
      // 检查是否已经参与
      const myNumber = await contract.methods.getPlayerNumber(roundId, account).call();
      if (Number(myNumber) > 0) {
        setError('您已经参与了这个轮次');
        setRoundLoading(roundId, false);
        return;
      }

      // 第一步：授权代币
      const tokenContract = new web3.eth.Contract(ERC20_ABI, round.tokenAddress);

      setSuccess('步骤1/2: 正在授权代币...');
      await tokenContract.methods
        .approve(contractAddress, round.burnAmount)
        .send({ from: account });

      // 第二步：加入游戏
      setSuccess('步骤2/2: 正在加入游戏...');
      await contract.methods
        .joinRound(roundId)
        .send({ from: account, value: round.ticketPrice });

      setSuccess('🎉 成功加入游戏！正在刷新数据...');

      // 重新加载数据
      setTimeout(() => {
        loadActiveRounds();
        setSuccess('');
      }, 3000);

    } catch (err) {
      console.error('加入游戏失败:', err);
      setError('操作失败: ' + (err.message || '未知错误'));
    } finally {
      setRoundLoading(roundId, false);
    }
  };

  // 获取玩家在轮次中的号码
  const getPlayerNumber = async (roundId) => {
    if (!contract || !account) return 0;
    try {
      const number = await contract.methods.getPlayerNumber(roundId, account).call();
      return Number(number);
    } catch (err) {
      console.error('获取玩家号码失败:', err);
      return 0;
    }
  };

  // 实时时间状态 - 每秒更新
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  // 每秒更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 计算倒计时 - 使用实时时间
  const getTimeLeft = (endTime) => {
    const left = endTime - currentTime;
    if (left <= 0) return '已结束';

    const hours = Math.floor(left / 3600);
    const minutes = Math.floor((left % 3600) / 60);
    const seconds = left % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 结算轮次
  const settleRound = async (roundId) => {
    if (!contract || !account) {
      setError('请先连接钱包');
      return;
    }

    setRoundLoading(roundId, true);
    setError('');

    try {
      setSuccess('正在结算轮次...');

      await contract.methods
        .settleRound(roundId)
        .send({ from: account });

      setSuccess('🎉 轮次结算成功！奖励已发放');

      // 重新加载数据
      setTimeout(() => {
        loadActiveRounds();
        setSuccess('');
      }, 3000);

    } catch (err) {
      console.error('结算失败:', err);
      setError('结算失败: ' + (err.message || '未知错误'));
    } finally {
      setRoundLoading(roundId, false);
    }
  };

  // 清理过期轮次
  const cleanupExpiredRounds = async () => {
    if (!contract || !account) {
      setError('请先连接钱包');
      return;
    }

    setLoading(true);
    setError('');

    try {
      setSuccess('🧹 正在清理过期轮次...');
      
      // 获取所有活跃轮次
      const activeRoundIds = await contract.methods.getActiveRounds().call();
      const currentTime = Math.floor(Date.now() / 1000);
      let cleanedCount = 0;

      // 遍历所有轮次，找到过期且无人参与的轮次
      for (const roundId of activeRoundIds) {
        try {
          const info = await contract.methods.getRoundInfo(Number(roundId)).call();
          
          // 如果轮次已过期且无人参与，进行结算清理
          if (currentTime >= info.endTime && info.participantCount === 0) {
            await contract.methods.settleRound(Number(roundId)).send({ from: account });
            cleanedCount++;
          }
        } catch (err) {
          console.error(`清理轮次 ${roundId} 失败:`, err);
        }
      }

      if (cleanedCount > 0) {
        setSuccess(`🎉 成功清理了 ${cleanedCount} 个过期轮次！`);
      } else {
        setSuccess('✅ 没有发现需要清理的过期轮次');
      }

      // 重新加载数据
      setTimeout(() => {
        loadActiveRounds();
        setSuccess('');
      }, 3000);

    } catch (err) {
      console.error('清理过期轮次失败:', err);
      setError('清理失败: ' + (err.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 移除自动结算功能 - 现在使用手动结算

  // 自动刷新数据
  useEffect(() => {
    if (contract && account) {
      const interval = setInterval(() => {
        loadActiveRounds(); // 每次刷新只加载数据，不自动结算
      }, 10000); // 每10秒刷新一次

      return () => clearInterval(interval);
    }
  }, [contract, account, loadActiveRounds]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="container mx-auto px-6 py-8 pb-24 md:pb-8 max-w-7xl relative z-10">
        {/* 主标题区域 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-4 glass-panel px-8 py-6 mb-6 clip-corner-top-right relative">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-blue"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-blue"></div>

            <div className="text-6xl animate-float">🎯</div>
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-game font-black tracking-tight text-glow-blue bg-gradient-to-r from-neon-blue via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                {t('game.title')}
              </h2>
              <p className="text-gray-300 mt-2 font-mono text-sm">{t('game.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* 连接钱包 */}
        {!account && (
          <div className="text-center mb-8">
            <button
              onClick={connectWallet}
              className="relative group px-8 py-4 bg-game-black border-2 border-neon-blue clip-corner transition-all duration-300 hover:bg-neon-blue/10 hover:scale-105"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-neon-blue"></div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-neon-blue"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-neon-blue"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-neon-blue"></div>

              <span className="font-game text-xl font-bold text-white group-hover:text-neon-blue transition-colors">
                🦊 {t('game.connect_wallet')}
              </span>
            </button>
          </div>
        )}

        {/* 管理员模式切换 - 仅合约所有者可见 */}
        {isContractOwner() && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`relative px-8 py-3 clip-corner border-2 transition-all duration-300 group hover:scale-105 ${isAdminMode
                ? 'bg-neon-pink/10 border-neon-pink text-neon-pink shadow-[0_0_20px_rgba(255,0,153,0.3)]'
                : 'bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[0_0_20px_rgba(0,243,255,0.3)]'
                }`}
            >
              {/* Corner accents */}
              <div className={`absolute top-0 left-0 w-1 h-1 ${isAdminMode ? 'bg-neon-pink' : 'bg-neon-blue'}`}></div>
              <div className={`absolute top-0 right-0 w-1 h-1 ${isAdminMode ? 'bg-neon-pink' : 'bg-neon-blue'}`}></div>
              <div className={`absolute bottom-0 left-0 w-1 h-1 ${isAdminMode ? 'bg-neon-pink' : 'bg-neon-blue'}`}></div>
              <div className={`absolute bottom-0 right-0 w-1 h-1 ${isAdminMode ? 'bg-neon-pink' : 'bg-neon-blue'}`}></div>

              <div className="flex items-center space-x-3 font-game tracking-wider">
                <span className="text-xl">{isAdminMode ? '👨‍💼' : '🎮'}</span>
                <span className="font-bold">{isAdminMode ? t('game.owner_mode').toUpperCase() : t('game.admin_mode').toUpperCase()}</span>
              </div>
            </button>
          </div>
        )}

        {/* 普通用户显示 */}
        {account && !isContractOwner() && (
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-md border border-green-500/20 rounded-xl px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  🎮
                </div>
                <div>
                  <div className="font-semibold text-green-300">{t('game.game_mode')}</div>
                  <div className="text-xs text-gray-400">{t('game.game_mode_desc')}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 自动连接合约状态 */}
        {account && !contract && contractAddress && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-blue-500/20">
            <div className="text-center">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="animate-spin w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full"></div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {t('game.connecting_contract')}
                </span>
              </div>
              <div className="text-sm text-gray-300 font-mono bg-black/20 px-4 py-2 rounded-lg inline-block break-all">
                {contractAddress}
              </div>
            </div>
          </div>
        )}

        {/* 设置合约 */}
        {account && !contract && !contractAddress && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4">🔗 设置合约地址</h3>

            {/* 显示默认合约地址 */}
            {contractAddress && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <div className="text-green-300 font-bold mb-1">✅ 已配置默认合约地址</div>
                <div className="text-sm text-gray-300 break-all">{contractAddress}</div>
                <button
                  onClick={() => setupContract()}
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded text-sm"
                >
                  使用此地址
                </button>
              </div>
            )}

            {/* 手动输入选项 */}
            <div className="flex gap-4">
              <input
                type="text"
                value={inputContractAddress}
                onChange={(e) => setInputContractAddress(e.target.value)}
                placeholder={contractAddress ? "或输入其他合约地址..." : "输入多轮游戏合约地址..."}
                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={setupContract}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
              >
                设置合约
              </button>
            </div>
          </div>
        )}

        {/* 状态消息 */}
        {(loading || error || success) && (
          <div className="mb-6">
            {loading && (
              <div className="bg-blue-500/20 border border-blue-500/50 text-blue-200 px-4 py-3 rounded-lg">
                ⏳ 处理中，请稍候...
              </div>
            )}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                ❌ {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg">
                ✅ {success}
              </div>
            )}
          </div>
        )}

        {/* 管理员面板 - 仅合约所有者可见 */}
        {isContractOwner() && isAdminMode && contract && (
          <div className="relative glass-panel clip-corner p-8 mb-8 border-neon-pink/30">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-neon-pink"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-neon-pink"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-neon-pink"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-neon-pink"></div>

            <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-neon-pink/20">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 clip-corner flex items-center justify-center border-2 border-neon-pink">
                <span className="text-3xl">👨‍💼</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-game font-black tracking-tight text-neon-pink text-glow-pink">
                  OWNER TERMINAL
                </h3>
                <p className="text-gray-400 text-xs font-mono mt-1">ROOT ACCESS · ROUND MANAGEMENT</p>
                <p className="text-[10px] text-gray-500 mt-1 font-mono">
                  AUTH: {contractOwner.slice(0, 10)}...{contractOwner.slice(-8)}
                </p>
              </div>
              <div className="text-neon-green text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                  <span>ACTIVE</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">燃料代币地址</label>

                {/* 快捷代币选择 */}
                {(process.env.REACT_APP_TEST_TOKEN_1 || process.env.REACT_APP_TEST_TOKEN_2) && (
                  <div className="mb-3 flex gap-2 flex-wrap">
                    <span className="text-sm text-gray-400">快捷选择:</span>
                    {process.env.REACT_APP_TEST_TOKEN_1 && (
                      <button
                        onClick={() => {
                          setAdminTokenAddr(process.env.REACT_APP_TEST_TOKEN_1);
                          setTokenStatus(null);
                        }}
                        className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded"
                      >
                        测试代币1
                      </button>
                    )}
                    {process.env.REACT_APP_TEST_TOKEN_2 && (
                      <button
                        onClick={() => {
                          setAdminTokenAddr(process.env.REACT_APP_TEST_TOKEN_2);
                          setTokenStatus(null);
                        }}
                        className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded"
                      >
                        测试代币2
                      </button>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={adminTokenAddr}
                    onChange={(e) => {
                      setAdminTokenAddr(e.target.value.trim());
                      setTokenStatus(null); // 清除之前的状态
                    }}
                    placeholder="0x... (输入ERC20代币地址)"
                    className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={async () => {
                      if (adminTokenAddr) {
                        const status = await checkTokenStatus(adminTokenAddr);
                        setTokenStatus(status);
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg whitespace-nowrap"
                  >
                    检查状态
                  </button>
                </div>

                {/* 代币状态显示 */}
                {tokenStatus && (
                  <div className={`mt-2 p-3 rounded-lg ${tokenStatus.canStart ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                    {tokenStatus.canStart ? (
                      <div>
                        <div className="text-green-400 font-bold">✅ {tokenStatus.tokenSymbol} ({tokenStatus.tokenName})</div>
                        <div className="text-sm text-gray-300 mt-1">
                          储备金: {tokenStatus.reservePool} BNB | 历史轮次: {tokenStatus.totalRounds}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-red-400 font-bold">❌ {tokenStatus.tokenSymbol} ({tokenStatus.tokenName})</div>
                        <div className="text-sm text-gray-300 mt-1">
                          该代币已有活跃轮次 #{tokenStatus.activeRoundId}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">销毁数量</label>
                <input
                  type="number"
                  value={adminBurnAmount}
                  onChange={(e) => setAdminBurnAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">门票价格 (BNB)</label>
                <input
                  type="number"
                  step="0.001"
                  value={adminTicketPrice}
                  onChange={(e) => setAdminTicketPrice(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">持续时间 (小时)</label>
                <input
                  type="number"
                  step="0.1"
                  value={adminDuration}
                  onChange={(e) => setAdminDuration(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 开启新轮次按钮 */}
              <button
                onClick={startNewRound}
                disabled={loading}
                className="group relative bg-transparent border-2 border-neon-pink clip-corner p-6 hover:bg-neon-pink/10 transition-all duration-300 shadow-[0_0_20px_rgba(255,0,153,0.3)] hover:shadow-[0_0_30px_rgba(255,0,153,0.6)] overflow-hidden"
              >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-neon-pink"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-neon-pink"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-neon-pink"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-neon-pink"></div>

                <span className="relative z-10 flex items-center justify-center space-x-2 font-game text-lg font-bold text-neon-pink group-hover:text-white transition-colors">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>INITIALIZING...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>LAUNCH NEW ROUND</span>
                    </>
                  )}
                </span>
              </button>

              {/* 清理过期轮次按钮 */}
              <button
                onClick={cleanupExpiredRounds}
                disabled={loading}
                className="group relative bg-transparent border-2 border-yellow-500 clip-corner p-6 hover:bg-yellow-500/10 transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] overflow-hidden"
              >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-500"></div>

                <span className="relative z-10 flex items-center justify-center space-x-2 font-game text-lg font-bold text-yellow-500 group-hover:text-white transition-colors">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>CLEANING...</span>
                    </>
                  ) : (
                    <>
                      <span>🧹</span>
                      <span>CLEANUP EXPIRED</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* 活跃轮次列表 */}
        {contract && (
          <div className="space-y-8">
            {/* 标题区域 */}
            {/* 标题区域 */}
            <div className="relative glass-panel clip-corner p-6 border-neon-green/30">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-green"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-green"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-green"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-green"></div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-game-dark clip-corner flex items-center justify-center border border-neon-green/50">
                    <span className="text-2xl animate-pulse">🎯</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-game font-bold text-neon-green text-glow-green tracking-wide">
                      {t('game.hall.title').toUpperCase()}
                    </h2>
                    <p className="text-gray-400 text-xs font-mono mt-1 tracking-widest">{t('game.hall.desc').toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-8 bg-black/20 p-3 rounded-lg border border-white/5">
                  <div className="text-center px-4 border-r border-white/10">
                    <div className="text-2xl font-game text-white">{totalRounds}</div>
                    <div className="text-[10px] text-gray-500 font-mono uppercase">{t('game.hall.total_rounds')}</div>
                  </div>
                  <div className="text-center px-4">
                    <div className="text-2xl font-game text-neon-blue">{activeRounds.length}</div>
                    <div className="text-[10px] text-gray-500 font-mono uppercase">{t('game.hall.active')}</div>
                  </div>
                  <div className="flex flex-col items-center justify-center pl-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-[0_0_10px_#00ff9d]"></div>
                    <span className="text-[8px] text-neon-green mt-1 font-mono">ONLINE</span>
                  </div>
                </div>
              </div>
            </div>

            {activeRounds.length === 0 ? (
              <div className="relative glass-panel clip-corner p-12 text-center border-white/5 flex flex-col items-center justify-center min-h-[300px]">
                {/* Scanline overlay for this specific panel */}
                <div className="absolute inset-0 bg-scanline opacity-10 pointer-events-none"></div>

                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-700 animate-[spin_10s_linear_infinite] flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-gray-600 flex items-center justify-center">
                      <span className="text-4xl opacity-50">📡</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-game-black px-2 text-[10px] text-gray-500 font-mono">
                    SCANNING
                  </div>
                </div>

                <h3 className="text-2xl font-game text-gray-500 tracking-widest mb-2">
                  {t('game.hall.no_games').toUpperCase()}
                </h3>
                <p className="text-gray-600 font-mono text-xs">
                  SYSTEM STANDBY... WAITING FOR SIGNAL
                </p>

                {isAdminMode && (
                  <div className="mt-8 p-4 border border-neon-pink/30 bg-neon-pink/5 rounded clip-corner max-w-md">
                    <p className="text-neon-pink font-mono text-xs animate-pulse">
                      ⚠ ADMIN ALERT: {t('game.hall.admin_hint')}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-6">
                {activeRounds.map((round) => (
                  <RoundCard
                    key={round.roundId}
                    round={round}
                    isParticipated={myActiveRounds.includes(round.roundId)}
                    onJoin={() => joinRound(round.roundId)}
                    onSettle={() => settleRound(round.roundId)}
                    getTimeLeft={getTimeLeft}
                    getPlayerNumber={getPlayerNumber}
                    account={account}
                    loading={roundLoadingStates[round.roundId] || false}
                    isContractOwner={isContractOwner}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 轮次卡片组件
function RoundCard({ round, isParticipated, onJoin, onSettle, getTimeLeft, getPlayerNumber, account, loading, isContractOwner }) {
  const { t } = useLanguage();
  const [playerNumber, setPlayerNumber] = useState(0);

  useEffect(() => {
    if (isParticipated) {
      getPlayerNumber(round.roundId).then(setPlayerNumber);
    }
  }, [round.roundId, isParticipated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate progress percentage
  const progressPercent = (round.participantCount / 20) * 100;

  // Calculate time progress (assuming 24h max for visualization if total duration unknown, or just use remaining)
  // For visual flair, we'll just use a static ring for time or calculate based on start/end
  const totalDuration = round.endTime - round.startTime;
  const elapsed = (Date.now() / 1000) - round.startTime;
  const timePercent = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));

  return (
    <div className="group relative glass-panel clip-corner overflow-hidden hover:border-neon-blue/80 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,243,255,0.2)]">
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-blue/50 group-hover:border-neon-blue transition-colors"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-blue/50 group-hover:border-neon-blue transition-colors"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-blue/50 group-hover:border-neon-blue transition-colors"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-blue/50 group-hover:border-neon-blue transition-colors"></div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/0 via-neon-blue/5 to-neon-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Card Header */}
      <div className="relative p-5 border-b border-neon-blue/10 flex justify-between items-center bg-gradient-to-r from-game-dark/80 to-game-dark/50">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 bg-game-dark rounded-lg flex items-center justify-center border-2 border-neon-blue/30 group-hover:border-neon-blue transition-all clip-corner">
              <span className="font-game text-2xl text-neon-blue font-black text-glow-blue">#{round.roundId}</span>
            </div>
            {/* Status Dot */}
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-game-dark ${Date.now() / 1000 >= round.endTime ? 'bg-red-500 animate-pulse' : 'bg-neon-green animate-pulse'
              }`}></div>
          </div>

          <div>
            <h3 className="font-game text-xl text-white tracking-widest group-hover:text-neon-blue transition-colors">
              {round.tokenSymbol || 'UNKNOWN'}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono mt-1">
              <span>{round.tokenName || 'Unknown Token'}</span>
              <span className="w-1 h-1 bg-neon-pink rounded-full animate-pulse"></span>
              <span className="text-neon-pink font-bold">{t('game.card.burning').toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-game text-3xl text-neon-green text-glow-blue">
            {(() => {
              const currentPot = Web3.utils.fromWei(round.currentPot?.toString() || '0', 'ether');
              const inheritedReserve = Web3.utils.fromWei(round.inheritedReserve?.toString() || '0', 'ether');
              const totalPot = (parseFloat(currentPot) + parseFloat(inheritedReserve)).toFixed(4);
              return totalPot;
            })()}
            <span className="text-sm ml-1 text-gray-400">BNB</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">{t('game.card.prize_pool').toUpperCase()}</div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Participants Circular Progress */}
          <div className="bg-game-dark/50 rounded-xl p-3 flex items-center space-x-3 border border-white/5">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-800" />
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
                  className="text-neon-blue transition-all duration-1000 ease-out"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - progressPercent / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                {Math.round(progressPercent)}%
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-white">{round.participantCount}/20</div>
              <div className="text-[10px] text-gray-400 uppercase">{t('game.card.players').toUpperCase()}</div>
            </div>
          </div>

          {/* Time Circular Progress */}
          <div className="bg-game-dark/50 rounded-xl p-3 flex items-center space-x-3 border border-white/5">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-800" />
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
                  className={`${Date.now() / 1000 >= round.endTime ? 'text-red-500' : 'text-neon-purple'} transition-all duration-1000 ease-out`}
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - timePercent / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs">
                {Date.now() / 1000 >= round.endTime ? t('game.card.status.end').toUpperCase() : t('game.card.status.run').toUpperCase()}
              </div>
            </div>
            <div>
              <div className={`text-sm font-bold ${Date.now() / 1000 >= round.endTime ? 'text-red-400' : 'text-white'}`}>
                {getTimeLeft(round.endTime)}
              </div>
              <div className="text-[10px] text-gray-400 uppercase">{t('game.card.time_left').toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Info Row */}
        <div className="flex justify-between items-center mb-6 text-xs text-gray-400 font-mono bg-black/20 p-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <span>{t('game.card.ticket').toUpperCase()}:</span>
            <span className="text-white">{parseFloat(Web3.utils.fromWei(round.ticketPrice?.toString() || '0', 'ether')).toFixed(3)} BNB</span>
          </div>
          <div className="w-px h-3 bg-gray-700"></div>
          <div className="flex items-center space-x-2">
            <span>{t('game.card.burn').toUpperCase()}:</span>
            <span className="text-white">{parseFloat(Web3.utils.fromWei(round.burnAmount?.toString() || '0', 'ether')).toFixed(0)} {t('game.card.tokens').toUpperCase()}</span>
          </div>
        </div>

        {/* Action Button */}
        {Date.now() / 1000 >= round.endTime && round.participantCount > 0 && round.isActive ? (
          (() => {
            const isWinner = round.maxNumberHolder && round.maxNumberHolder.toLowerCase() === account?.toLowerCase();
            const canSettle = isWinner || isContractOwner();

            if (!canSettle) {
              return (
                <div className="w-full bg-gray-800/50 border border-gray-700 text-gray-400 font-mono py-3 px-6 rounded-xl text-center flex flex-col items-center justify-center">
                  <span className="font-bold">{t('game.card.status.waiting').toUpperCase()}</span>
                  {round.maxNumberHolder && (
                    <span className="text-[10px] mt-1 text-gray-500">{t('game.card.winner').toUpperCase()}: {round.maxNumberHolder.slice(0, 6)}...{round.maxNumberHolder.slice(-4)}</span>
                  )}
                </div>
              );
            }

            return (
              <button
                onClick={onSettle}
                disabled={loading}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>{loading ? 'PROCESSING...' : isWinner ? '🏆 ' + t('game.card.claim').toUpperCase() : '⚡ ' + t('game.card.settle').toUpperCase()}</span>
                </span>
              </button>
            );
          })()
        ) : isParticipated ? (
          <div className="bg-neon-green/10 border border-neon-green/30 rounded-xl p-3 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-neon-green/5 animate-pulse"></div>
            <div className="relative z-10">
              <div className="text-neon-green font-bold text-sm">{t('game.card.joined').toUpperCase()}</div>
              {playerNumber > 0 && (
                <div className="text-xs text-gray-300 mt-1 font-mono">
                  {t('game.card.your_number').toUpperCase()}: <span className="text-white font-bold text-lg">{playerNumber}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={onJoin}
            disabled={loading || round.participantCount >= 20 || Date.now() / 1000 >= round.endTime}
            className="relative w-full group px-6 py-4 bg-game-black border-2 border-neon-blue clip-corner transition-all duration-300 hover:bg-neon-blue/10 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-game-black disabled:hover:scale-100"
          >
            {/* Corner markers */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-neon-blue"></div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-neon-blue"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-neon-blue"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-neon-blue"></div>

            {/* Scan line effect */}
            <div className="absolute inset-0 bg-neon-blue/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>

            <span className="relative z-10 flex items-center justify-center space-x-2 font-game text-lg font-bold text-neon-blue group-hover:text-white transition-colors">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>PROCESSING...</span>
                </>
              ) : round.participantCount >= 20 ? (
                <span>🚫 {t('game.card.full').toUpperCase()}</span>
              ) : Date.now() / 1000 >= round.endTime ? (
                <span>⏰ {t('game.card.expired').toUpperCase()}</span>
              ) : (
                <>
                  <span>🎲 {t('game.card.enter_game').toUpperCase()}</span>
                  <span className="text-xs opacity-70 font-mono">
                    [{parseFloat(Web3.utils.fromWei(round.ticketPrice?.toString() || '0', 'ether')).toFixed(3)} BNB]
                  </span>
                </>
              )}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default GamePage;
