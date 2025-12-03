import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const selectLanguage = (lang) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={toggleDropdown}
                className={`
          relative flex items-center justify-center space-x-2 px-4 h-10
          bg-game-dark/80 border border-neon-blue/30 
          clip-corner transition-all duration-300
          hover:bg-neon-blue/10 hover:border-neon-blue/60 hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]
          ${isOpen ? 'bg-neon-blue/10 border-neon-blue shadow-[0_0_20px_rgba(0,243,255,0.4)]' : ''}
        `}
            >
                <span className="text-lg">{language === 'en' ? '🇺🇸' : '🇨🇳'}</span>
                <span className="text-neon-blue font-mono text-xs tracking-wider">
                    {language === 'en' ? 'ENG' : 'CHN'}
                </span>
                <div className={`
          w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-neon-blue
          transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}
        `}></div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop to close */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>

                    {/* Menu */}
                    <div className="absolute top-full right-0 mt-2 w-32 z-50">
                        <div className="relative bg-game-black/95 backdrop-blur-xl border border-neon-blue/40 rounded clip-corner shadow-[0_0_20px_rgba(0,243,255,0.15)] overflow-hidden">
                            {/* Scanline effect */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent animate-scanline"></div>

                            <div className="flex flex-col p-1">
                                <button
                                    onClick={() => selectLanguage('en')}
                                    className={`
                    flex items-center space-x-3 px-3 py-2 rounded transition-colors
                    ${language === 'en' ? 'bg-neon-blue/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                                >
                                    <span className="text-lg">🇺🇸</span>
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs font-bold tracking-wide">ENGLISH</span>
                                        <span className="text-[10px] text-neon-blue/70 font-mono">US-STD</span>
                                    </div>
                                </button>

                                <div className="h-[1px] bg-white/10 my-1"></div>

                                <button
                                    onClick={() => selectLanguage('zh')}
                                    className={`
                    flex items-center space-x-3 px-3 py-2 rounded transition-colors
                    ${language === 'zh' ? 'bg-neon-blue/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                                >
                                    <span className="text-lg">🇨🇳</span>
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs font-bold tracking-wide">CHINESE</span>
                                        <span className="text-[10px] text-neon-blue/70 font-mono">CN-SIM</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LanguageSwitcher;
