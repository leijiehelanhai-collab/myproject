import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from './contexts/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';

function Navigation({ account, connectWallet, disconnectWallet }) {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: '/', label: t('nav.home'), icon: '🏠' },
    { path: '/game', label: t('nav.game'), icon: '🎮' },
    { path: '/swap', label: t('nav.swap'), icon: '🔄' },
    { path: '/rewards', label: t('nav.rewards'), icon: '🎁' }
  ];

  return (
    <>
      {/* Desktop HUD Navigation */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="relative">
            {/* HUD Frame */}
            <div className="absolute inset-0 bg-game-black/80 backdrop-blur-md clip-corner-top-right border-b border-neon-blue/30 shadow-[0_0_15px_rgba(0,243,255,0.1)]"></div>

            <div className="relative z-10 flex items-center justify-between px-6 py-3">
              {/* Logo Section */}
              <Link to="/" className="flex items-center space-x-4 group">
                <div className="relative w-10 h-10 flex items-center justify-center bg-game-dark border border-neon-blue/50 rounded transform group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-neon-blue/20 animate-pulse"></div>
                  <span className="text-neon-blue font-game text-xl font-bold relative z-10">B</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-game text-lg tracking-wider group-hover:text-neon-blue transition-colors">{t('nav.title')}</span>
                  <span className="text-xs text-gray-400 font-mono tracking-widest">{t('nav.system_online')}</span>
                </div>
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-6 py-2 font-game text-sm tracking-wide transition-all duration-300 clip-corner ${location.pathname === item.path
                      ? 'text-game-black bg-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.5)]'
                      : 'text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10'
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Right Status Panel */}
              <div className="flex items-center space-x-6">
                {/* Language Selector */}
                <LanguageSwitcher />

                {/* Wallet Connection */}
                {account ? (
                  <div className="flex items-center space-x-3 bg-game-dark/80 border border-neon-green/50 px-4 h-10 clip-corner shadow-[0_0_15px_rgba(0,255,157,0.2)] hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-shadow duration-300">
                    <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                    <span className="text-neon-green font-mono text-sm tracking-wider">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="group relative px-6 h-10 flex items-center justify-center overflow-hidden clip-corner bg-transparent border border-neon-blue text-neon-blue font-game text-sm tracking-wider hover:bg-neon-blue hover:text-game-black transition-all duration-300 shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]"
                  >
                    <span className="relative z-10">{t('nav.connect')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-game-black/90 backdrop-blur-xl border-b border-neon-blue/30">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-game-dark border border-neon-blue/50 rounded flex items-center justify-center">
              <span className="text-neon-blue font-game font-bold">B</span>
            </div>
            <span className="text-white font-game text-sm">INCINERATOR</span>
          </Link>

          <div className="flex items-center space-x-3">
            <LanguageSwitcher />

            {account ? (
              <button
                onClick={disconnectWallet}
                className="h-10 w-12 flex items-center justify-center bg-transparent border-none clip-corner transition-transform duration-300 hover:scale-110"
                title="Disconnect Wallet"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
                  <rect x="2" y="2" width="28" height="28" rx="8" fill="#00f3ff" />
                  <path d="M22 10H10C8.89543 10 8 10.8954 8 12V20C8 21.1046 8.89543 22 10 22H22C23.1046 22 24 21.1046 24 20V12C24 10.8954 23.1046 10 22 10Z" stroke="#050510" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="19" cy="16" r="2" fill="#050510" />
                </svg>
                <div className="absolute bottom-1 right-1 w-2 h-2 bg-neon-green border border-black rounded-full animate-pulse shadow-[0_0_5px_#00ff9d]"></div>
              </button>
            ) : (
              <button
                onClick={connectWallet}
                className="h-10 px-4 border border-neon-blue text-neon-blue clip-corner font-game text-xs hover:bg-neon-blue hover:text-game-black transition-colors flex items-center justify-center"
              >
                CONNECT
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-game-black/95 backdrop-blur-xl border-t border-neon-blue/30 pb-safe">
        <div className="flex justify-around items-center py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 transition-all duration-300 ${isActive
                  ? 'text-neon-blue scale-110 drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]'
                  : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                <span className="text-3xl mb-1.5">{item.icon}</span>
                <span className={`text-xs font-game tracking-wider ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-neon-blue rounded-full mt-1 animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Navigation;
