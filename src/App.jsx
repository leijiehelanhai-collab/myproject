import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Web3 from 'web3';
import Navigation from './Navigation';
import HomePage from './HomePage';
import GamePage from './GamePage';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext';

// 占位页面组件
const PlaceholderPage = ({ title, icon }) => (
  <div className="min-h-screen text-white pb-24 md:pb-8">
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      <div className="text-center">
        <div className="text-8xl mb-8">{icon}</div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          {title}
        </h1>
        <p className="text-xl text-gray-300 mb-8">功能开发中，敬请期待...</p>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-center space-x-4 text-gray-400">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <p className="mt-4 text-sm">Coming Soon...</p>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  // 钱包连接状态 - 在顶层管理，供所有页面使用
  const [account, setAccount] = useState('');

  // 连接钱包函数
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
      } else {
        alert('❌ 请安装MetaMask钱包');
      }
    } catch (err) {
      console.error('连接钱包失败:', err);
    }
  };

  // 监听账户变化
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
      });

      // 检查是否已连接
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  // 断开钱包函数
  const disconnectWallet = () => {
    setAccount('');
  };

  return (
    <LanguageProvider>
      <Router>
        <div className="App min-h-screen pt-20 md:pt-24 relative">
          {/* Global Background Effects */}
          <div className="bg-grid-pattern"></div>
          <div className="bg-vignette"></div>
          <div className="scanline-overlay"></div>
          {/* <BackgroundParticles /> */}

          {/* 导航组件 */}
          <Navigation account={account} connectWallet={connectWallet} disconnectWallet={disconnectWallet} />

          {/* 路由内容 */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage account={account} />} />
            <Route path="/swap" element={
              <PlaceholderPage title="Swap" icon="🔄" />
            } />
            <Route path="/rewards" element={
              <PlaceholderPage title="Rewards" icon="🎁" />
            } />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
