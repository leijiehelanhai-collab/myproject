import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from './contexts/LanguageContext';

function HomePage() {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Intro animation sequence
    setTimeout(() => setShowContent(true), 500);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Elements are handled in App.jsx (Grid, Vignette, Scanline) */}

      {/* Central Content */}
      <div className={`relative z-10 text-center transition-all duration-1000 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} px-4`}>

        {/* Main Title Glitch Effect */}
        <div className="relative mb-8 group">
          <h1 className="text-5xl md:text-9xl font-game font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 relative z-10">
            {t('home.hero_title')}
          </h1>
          {/* Glitch Layers */}
          <h1 className="absolute top-0 left-0 text-5xl md:text-9xl font-game font-black tracking-tighter text-neon-blue opacity-0 group-hover:opacity-70 animate-glitch" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px)' }}>
            {t('home.hero_title')}
          </h1>
          <h1 className="absolute top-0 left-0 text-5xl md:text-9xl font-game font-black tracking-tighter text-neon-pink opacity-0 group-hover:opacity-70 animate-glitch" style={{ clipPath: 'polygon(0 60%, 100% 60%, 100% 100%, 0 100%)', transform: 'translate(2px)', animationDirection: 'reverse' }}>
            {t('home.hero_title')}
          </h1>
        </div>

        {/* Subtitle / Edition */}
        <div className="flex flex-col items-center space-y-2 mb-12">
          <div className="flex items-center space-x-4">
            <div className="h-[1px] w-12 bg-neon-blue/50"></div>
            <p className="text-neon-blue font-mono tracking-[0.3em] text-sm md:text-base uppercase">
              {t('home.hero_edition')}
            </p>
            <div className="h-[1px] w-12 bg-neon-blue/50"></div>
          </div>
          <p className="text-gray-400 font-game text-lg max-w-2xl px-4">
            {t('home.hero_desc_title')}
          </p>
        </div>

        {/* Press Start Button */}
        <Link
          to="/game"
          className="relative inline-block group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute inset-0 bg-neon-blue blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          <div className={`
            relative px-12 py-6 bg-game-black border-2 border-neon-blue 
            clip-corner transition-all duration-300
            ${isHovered ? 'transform scale-105 bg-neon-blue/10' : ''}
          `}>
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-neon-blue"></div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-neon-blue"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-neon-blue"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-neon-blue"></div>

            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-4xl font-game font-bold text-white tracking-widest group-hover:text-neon-blue transition-colors">
                {t('home.start_playing').toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-neon-blue/70 mt-1 tracking-[0.5em] animate-pulse">
                PRESS TO INITIALIZE
              </span>
            </div>
          </div>
        </Link>

        {/* Stats / Info Grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 px-4 max-w-5xl mx-auto">
          <StatCard icon="🔥" label={t('home.features.burn.title')} value="100%" delay="0" />
          <StatCard icon="🎲" label={t('home.features.unique.title')} value="1/20" delay="100" />
          <StatCard icon="🏆" label={t('home.features.winner.title')} value="80%" delay="200" />
          <StatCard icon="⚡" label={t('home.bsc_testnet')} value="ONLINE" delay="300" />
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end opacity-50 pointer-events-none">
        <div className="font-mono text-xs text-neon-blue/50">
          SYS.VER.2.0.4<br />
          CONNECTED: SECURE
        </div>
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-8 h-1 bg-neon-blue/20"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper Component for Stats
const StatCard = ({ icon, label, value, delay }) => (
  <div
    className="bg-game-card backdrop-blur-sm border border-white/5 p-4 rounded clip-corner hover:border-neon-blue/50 transition-colors duration-300"
    style={{ animation: `float 6s ease-in-out infinite ${delay}ms` }}
  >
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-neon-blue font-game font-bold text-xl">{value}</div>
    <div className="text-gray-500 text-xs font-mono uppercase mt-1">{label}</div>
  </div>
);

export default HomePage;
