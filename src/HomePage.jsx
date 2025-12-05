import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from './contexts/LanguageContext';
import GalaxyBackground from './components/GalaxyBackground';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Cpu,
  Dice5,
  Flame,
  Shield,
  Ticket,
  TrendingUp,
  Zap
} from 'lucide-react';

function HomePage({ account, connectWallet }) {
  const { t } = useLanguage();
  const [showContent, setShowContent] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const isConnected = Boolean(account);

  const handleConnect = async () => {
    if (!connectWallet || isConnecting) return;
    setIsConnecting(true);
    try {
      await connectWallet();
    } finally {
      setIsConnecting(false);
    }
  };



  const philosophy = [
    { title: t('home.philosophy.p1_title'), desc: t('home.philosophy.p1_desc') },
    { title: t('home.philosophy.p2_title'), desc: t('home.philosophy.p2_desc') }
  ];

  const burnPillars = [
    { title: t('home.philosophy.f1_title'), desc: t('home.philosophy.f1_desc'), icon: <Flame className="w-6 h-6 text-orange-400" /> },
    { title: t('home.philosophy.f2_title'), desc: t('home.philosophy.f2_desc'), icon: <Cpu className="w-6 h-6 text-neon-blue" /> }
  ];

  const matrixGames = [
    { title: t('home.ecosystem.roulette.title'), desc: t('home.ecosystem.roulette.desc'), icon: <Dice5 className="w-8 h-8 text-purple-300" />, accent: 'bg-purple-500/10 text-purple-200 border-purple-500/40' },
    { title: t('home.ecosystem.survivor.title'), desc: t('home.ecosystem.survivor.desc'), icon: <TrendingUp className="w-8 h-8 text-red-300" />, accent: 'bg-red-500/10 text-red-200 border-red-500/40' },
    { title: t('home.ecosystem.raid.title'), desc: t('home.ecosystem.raid.desc'), icon: <Ticket className="w-8 h-8 text-yellow-200" />, accent: 'bg-yellow-500/10 text-yellow-100 border-yellow-500/40' }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-white font-body">
      <GalaxyBackground withBlackHole={true} />


      <div className={`relative z-10 transition-all duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>

        {/* HERO */}
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 pt-16 pb-24">
          <div className="max-w-7xl mx-auto w-full">
            {/* Centered Hero Content */}
            <div className="text-center space-y-10 mb-20">
              {/* Edition Badge with Enhanced Styling */}
              <div className="flex justify-center animate-float">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-black/70 via-black/50 to-black/70 border border-neon-blue/50 px-8 py-3 clip-corner backdrop-blur-xl shadow-[0_0_30px_rgba(0,243,255,0.2)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-neon-blue animate-pulse shadow-[0_0_10px_rgba(0,243,255,0.8)]"></span>
                  <span className="text-sm font-mono tracking-[0.3em] text-neon-blue uppercase font-bold">{t('home.hero_edition')}</span>
                </div>
              </div>

              {/* Main Title with Enhanced Effects */}
              <div className="relative py-8">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter text-white font-cosmic drop-shadow-[0_0_30px_rgba(0,243,255,0.3)] text-glitch text-dynamic" data-text={t('home.hero_title')}>
                  {t('home.hero_title')}
                </h1>
                <div className="absolute -inset-8 bg-gradient-to-r from-transparent via-neon-blue/15 to-transparent blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent"></div>
              </div>

              {/* Description with Better Typography */}
              <div className="relative">
                <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto font-tech font-light tracking-wide">
                  {t('home.hero_desc')}
                </p>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent"></div>
              </div>

              {/* Action Buttons with Enhanced Design */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
                {isConnected ? (
                  <Link
                    to="/game"
                    className="group relative px-12 py-6 bg-gradient-to-r from-neon-blue via-neon-cyan to-white text-black font-black text-base tracking-[0.3em] mecha-btn shadow-[0_0_40px_rgba(0,243,255,0.5)] hover:shadow-[0_0_60px_rgba(0,243,255,0.8)] hover:scale-105 transition-all duration-300 uppercase font-tech"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {t('home.games.guess.btn')} <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mecha-btn"></div>
                  </Link>
                ) : (
                  <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className={`group relative px-12 py-6 bg-gradient-to-r from-neon-blue via-neon-cyan to-white text-black font-black text-base tracking-[0.3em] mecha-btn shadow-[0_0_40px_rgba(0,243,255,0.5)] hover:shadow-[0_0_60px_rgba(0,243,255,0.8)] hover:scale-105 transition-all duration-300 uppercase font-tech ${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    aria-busy={isConnecting}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {isConnecting ? t('home.connecting') : t('home.start_playing')} <Zap className="w-6 h-6 fill-current" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mecha-btn"></div>
                  </button>
                )}
                <a
                  href="#preface"
                  className="group px-12 py-6 border-2 border-white/50 text-white font-mono text-sm tracking-[0.3em] clip-corner hover:bg-white/15 hover:border-neon-blue/70 hover:text-neon-blue hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-all duration-300 uppercase backdrop-blur-sm"
                >
                  <span className="flex items-center gap-2">
                    {t('home.learn_more')}
                    <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                  </span>
                </a>
              </div>
            </div>




          </div>
        </section>

        {/* PREFACE */}
        <section id="preface" className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5 pointer-events-none"></div>
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="text-sm font-mono text-neon-blue tracking-[0.3em] uppercase text-decode">{t('home.preface.title')}</div>
              <p className="text-xl text-white leading-relaxed font-body">{t('home.preface.p1')}</p>
              <p className="text-lg text-gray-300 leading-relaxed font-body">{t('home.preface.p2')}</p>
              <p className="text-lg text-gray-300 leading-relaxed font-body">{t('home.preface.p3')}</p>
            </div>
            <div className="relative bg-gradient-to-br from-neon-blue/15 via-black/80 to-neon-pink/10 border border-neon-blue/30 rounded-3xl p-10 backdrop-blur-md shadow-[0_0_40px_rgba(0,243,255,0.15)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,243,255,0.25),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(255,0,153,0.2),transparent_30%)] opacity-60"></div>
              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono text-gray-300 tracking-[0.2em]">NEGENTROPY MANIFESTO</span>
                </div>
                <div className="h-0.5 w-full bg-gradient-to-r from-neon-blue via-transparent to-neon-pink opacity-60"></div>
                <div className="space-y-3 text-sm text-gray-200 font-mono leading-relaxed">
                  <p>{t('home.philosophy.f1_title')} · {t('home.philosophy.f1_desc')}</p>
                  <p>{t('home.philosophy.f2_title')} · {t('home.philosophy.f2_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="py-20 px-4 bg-black/40 border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight font-cosmic text-dynamic">{t('home.philosophy.title')}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {philosophy.map((item, idx) => (
                <PhilosophyCard key={idx} title={item.title} desc={item.desc} />
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {burnPillars.map((item, idx) => (
                <FeatureItem key={idx} title={item.title} desc={item.desc} icon={item.icon} />
              ))}
            </div>
          </div>
        </section>

        {/* FINANCIAL THERMODYNAMICS */}
        <section className="py-20 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black font-cosmic text-glow-cyan text-dynamic">{t('home.thermodynamics.title')}</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-body">{t('home.thermodynamics.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="game-card-enhanced card-dynamic-border p-8 rounded-2xl">
                <div className="game-card-corner corner-tl"></div>
                <div className="game-card-corner corner-tr"></div>
                <div className="game-card-corner corner-bl"></div>
                <div className="game-card-corner corner-br"></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Flame className="w-8 h-8 text-orange-400" />
                    <h3 className="text-2xl font-bold text-glow-cyan">{t('home.thermodynamics.anti_entropy.title')}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{t('home.thermodynamics.anti_entropy.desc')}</p>
                </div>
              </div>
              <div className="game-card-enhanced card-dynamic-border p-8 rounded-2xl">
                <div className="game-card-corner corner-tl"></div>
                <div className="game-card-corner corner-tr"></div>
                <div className="game-card-corner corner-bl"></div>
                <div className="game-card-corner corner-br"></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-8 h-8 text-neon-blue" />
                    <h3 className="text-2xl font-bold text-glow-cyan">{t('home.thermodynamics.event_horizon.title')}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{t('home.thermodynamics.event_horizon.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BINARY STAR SYSTEM */}
        <section className="py-20 px-4 bg-black/40 border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black font-cosmic text-dynamic">{t('home.binary_system.title')}</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-body">{t('home.binary_system.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 via-black/80 to-yellow-500/10 border border-orange-500/30 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,165,0,0.15),transparent_50%)] opacity-60"></div>
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-500/20 border border-orange-500/40 rounded-full">
                    <Cpu className="w-5 h-5 text-orange-400" />
                    <span className="text-sm font-mono text-orange-200 uppercase tracking-wider">{t('home.binary_system.fuel_token.title')}</span>
                  </div>
                  <p className="text-gray-200 leading-relaxed text-lg">{t('home.binary_system.fuel_token.desc')}</p>
                </div>
              </div>
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-yellow-500/10 via-black/80 to-green-500/10 border border-yellow-500/30 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,215,0,0.15),transparent_50%)] opacity-60"></div>
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-yellow-500/20 border border-yellow-500/40 rounded-full">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-mono text-yellow-200 uppercase tracking-wider">{t('home.binary_system.bnb_token.title')}</span>
                  </div>
                  <p className="text-gray-200 leading-relaxed text-lg">{t('home.binary_system.bnb_token.desc')}</p>
                </div>
              </div>
            </div>
            {/* Protocol Loop */}
            <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8 text-center text-glow-cyan">{t('home.binary_system.loop.title')}</h3>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {t('home.binary_system.loop.steps').map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div className="px-6 py-3 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/40 rounded-lg">
                        <span className="text-lg font-mono font-bold">{step}</span>
                      </div>
                      {idx < t('home.binary_system.loop.steps').length - 1 && (
                        <ArrowRight className="w-6 h-6 text-neon-blue" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROADMAP */}
        <section className="py-20 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black font-cosmic text-dynamic">{t('home.roadmap.title')}</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-body">{t('home.roadmap.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {['phase1', 'phase2', 'phase3', 'phase4'].map((phase, idx) => (
                <div key={idx} className="game-card-enhanced card-dynamic-border p-6 rounded-2xl">
                  <div className="game-card-corner corner-tl"></div>
                  <div className="game-card-corner corner-tr"></div>
                  <div className="game-card-corner corner-bl"></div>
                  <div className="game-card-corner corner-br"></div>
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${idx === 0 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                        idx === 1 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                          idx === 2 ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40' :
                            'bg-red-500/20 text-red-300 border border-red-500/40'
                        }`}>
                        {idx + 1}
                      </div>
                      <h3 className="text-xl font-bold text-glow-cyan">{t(`home.roadmap.${phase}.name`)}</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed pl-13">{t(`home.roadmap.${phase}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ECOSYSTEM */}
        <section id="ecosystem" className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black font-cosmic text-dynamic">{t('home.ecosystem.title')}</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-body">{t('home.ecosystem.desc')}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: Game Matrix (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="game-card-enhanced card-dynamic-border p-8 rounded-3xl h-full">
                  <div className="game-card-corner corner-tl"></div>
                  <div className="game-card-corner corner-tr"></div>
                  <div className="game-card-corner corner-bl"></div>
                  <div className="game-card-corner corner-br"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-3 h-3 rounded-full bg-neon-blue animate-pulse"></div>
                      <span className="text-sm font-mono text-neon-blue tracking-[0.3em] uppercase">{t('home.ecosystem.matrix_title')}</span>
                    </div>

                    <div className="space-y-4">
                      {matrixGames.map((game, idx) => (
                        <div key={idx} className="group relative p-6 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 hover:bg-white/10 transition-all duration-300">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                            {/* Icon */}
                            <div className={`p-4 rounded-xl border shrink-0 w-fit ${game.accent} group-hover:scale-110 transition-transform duration-300`}>
                              {game.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-grow space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white group-hover:text-neon-blue transition-colors">{game.title}</h3>
                                <span className="px-3 py-1 rounded text-xs font-mono bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                  {t('home.telemetry.live')}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm leading-relaxed">{game.desc}</p>
                            </div>

                            {/* Arrow */}
                            <div className="hidden sm:block text-white/20 group-hover:text-neon-blue group-hover:translate-x-2 transition-all">
                              <ArrowRight className="w-6 h-6" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: System & Features (1/3 width) */}
              <div className="space-y-6">
                {/* CTA Card */}
                <div className="game-card-enhanced card-dynamic-border p-8 rounded-3xl relative overflow-hidden group">
                  <div className="game-card-corner corner-tl"></div>
                  <div className="game-card-corner corner-tr"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/10 to-transparent opacity-50"></div>

                  <div className="relative z-10 text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-blue/20 border border-neon-blue/40 text-neon-blue text-xs font-mono tracking-wider">
                      <Zap className="w-3 h-3" />
                      SYSTEM ONLINE
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{t('home.games.title')}</h3>
                      <p className="text-sm text-gray-400">{t('home.games.subtitle')}</p>
                    </div>

                    <Link
                      to="/game"
                      className="block w-full py-4 bg-white text-black font-black text-sm tracking-[0.2em] clip-corner hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 uppercase"
                    >
                      {t('home.games.guess.btn')}
                    </Link>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">{t('home.features.fair.title')}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{t('home.features.fair.desc')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">{t('home.features.burn.title')}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{t('home.features.burn.desc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-20 px-4 max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center font-cosmic text-dynamic">{t('home.faq.title')}</h2>
          <div className="space-y-4">
            <FaqItem
              question={t('home.faq.q1')}
              answer={t('home.faq.a1')}
              isOpen={activeFaq === 0}
              onClick={() => toggleFaq(0)}
            />
            <FaqItem
              question={t('home.faq.q2')}
              answer={t('home.faq.a2')}
              isOpen={activeFaq === 1}
              onClick={() => toggleFaq(1)}
            />
            <FaqItem
              question={t('home.faq.q3')}
              answer={t('home.faq.a3')}
              isOpen={activeFaq === 2}
              onClick={() => toggleFaq(2)}
            />
            <FaqItem
              question={t('home.faq.q4')}
              answer={t('home.faq.a4')}
              isOpen={activeFaq === 3}
              onClick={() => toggleFaq(3)}
            />
            <FaqItem
              question={t('home.faq.q5')}
              answer={t('home.faq.a5')}
              isOpen={activeFaq === 4}
              onClick={() => toggleFaq(4)}
            />
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-neon-blue/10 to-transparent pointer-events-none"></div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight font-display text-dynamic">{t('home.cta.title')}</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-body">{t('home.cta.desc')}</p>
          {isConnected ? (
            <Link
              to="/game"
              className="inline-flex items-center justify-center px-12 py-5 bg-white text-black font-black text-lg clip-corner hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all duration-300 uppercase tracking-[0.2em]"
            >
              {t('home.games.guess.btn')}
            </Link>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`px-12 py-5 bg-white text-black font-black text-lg clip-corner hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all duration-300 uppercase tracking-[0.2em] ${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}`}
              aria-busy={isConnecting}
            >
              {isConnecting ? t('home.connecting') : t('home.cta.btn')}
            </button>
          )}
        </section>

        {/* FOOTER */}
        <footer className="py-12 border-t border-white/10 text-center text-gray-600 text-sm font-mono">
          <p>BNB ANNIHILATION PROTOCOL v3.0 // SYSTEM SECURE</p>
          <p className="mt-2">&copy; 2024 DECENTRALIZED VOID</p>
        </footer>

      </div>
    </div>
  );
}

// Components


const PhilosophyCard = ({ title, desc }) => (
  <div className="game-card-enhanced card-dynamic-border p-8 rounded-2xl hover:scale-105 transition-transform duration-500">
    <div className="game-card-corner corner-tl"></div>
    <div className="game-card-corner corner-tr"></div>
    <div className="game-card-corner corner-bl"></div>
    <div className="game-card-corner corner-br"></div>
    <div className="relative z-10 space-y-3">
      <h3 className="text-2xl font-bold text-glow-cyan">{title}</h3>
      <p className="text-sm text-gray-300 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const FeatureItem = ({ title, desc, icon }) => (
  <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-neon-blue/30 transition-all duration-300 group hover:-translate-y-2 card-dynamic-border hover:shadow-[0_0_30px_rgba(0,243,255,0.15)]">
    <div className="mb-6 p-4 bg-black rounded-full w-fit border border-white/10 group-hover:border-neon-blue/50 transition-colors">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-neon-blue transition-colors">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const FaqItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5 transition-all duration-300">
    <button
      className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      onClick={onClick}
    >
      <span className="text-lg font-bold text-gray-200">{question}</span>
      {isOpen ? <ChevronUp className="text-neon-blue" /> : <ChevronDown className="text-gray-500" />}
    </button>
    <div className={`px-8 transition-all duration-300 ${isOpen ? 'pb-8 max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
      <p className="text-gray-400 leading-relaxed">{answer}</p>
    </div>
  </div>
);

export default HomePage;

