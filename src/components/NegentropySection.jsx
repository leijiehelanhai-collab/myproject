import React, { useEffect, useRef, useState } from 'react';

const NegentropySection = () => {
  const [visibleModules, setVisibleModules] = useState([]);
  const moduleRefs = useRef([]);

  useEffect(() => {
    const observers = moduleRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleModules(prev => [...new Set([...prev, index])]);
          }
        },
        { threshold: 0.2 }
      );

      if (ref) observer.observe(ref);
      return observer;
    });

    return () => observers.forEach(observer => observer.disconnect());
  }, []);

  const modules = [
    {
      tag: "// LOG_ENTRY_001",
      status: "[SYSTEM_STATUS: CRITICAL]",
      title: "Entropy Problem",
      subtitle: "Cosmic Heat Death",
      content: "The ultimate fate of the universe is heat death, where all things tend towards disorder. But in the digital universe of BNB Chain, we are building a reverse singularity.",
      highlight: ["heat death", "disorder", "reverse singularity"],
      accentColor: "cyan"
    },
    {
      tag: "// LOG_ENTRY_002",
      status: "[PROTOCOL: ACTIVE]",
      title: "Black Hole Solution",
      subtitle: "B.A.P. Mechanism",
      content: "BNB Annihilation Protocol (B.A.P) is not a traditional GameFi platform; it is a massive decentralized black hole. In the existing crypto economy, inflation is the original sin of asset depreciation; in the world of B.A.P, we sublimate \"burning\" into an art form.",
      highlight: ["black hole", "burning", "art form"],
      accentColor: "pink"
    },
    {
      tag: "// LOG_ENTRY_003",
      status: "[VALUE: LOCKED]",
      title: "Value Singularity",
      subtitle: "Scarcity & Capture",
      content: "We invite you to enter the Event Horizon. Here, every game is a sacrifice towards death and rebirth, every interaction irreversibly reduces the total token supply. We do not create inflation; we manufacture scarcity. Join this magnificent annihilation, not just for entertainment, but to capture the eternity of value.",
      highlight: ["Event Horizon", "irreversibly", "manufacture scarcity", "eternity"],
      accentColor: "purple"
    }
  ];

  const highlightText = (text, highlights, color) => {
    if (!highlights || highlights.length === 0) return text;

    let result = text;
    highlights.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      result = result.replace(regex, `<span class="text-${color}-400 font-bold glow-${color}">$1</span>`);
    });

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <section className="relative min-h-screen bg-black py-20 px-4 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Main Title Section */}
        <div className="mb-20 text-center">
          <div className="inline-block relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-2xl" />
            <h2 className="relative text-6xl md:text-8xl font-bold font-mono tracking-wider">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient">
                THE ART OF
              </span>
              <br />
              <span className="text-white glitch-text" data-text="NEGENTROPY">
                NEGENTROPY
              </span>
            </h2>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4 text-cyan-400 font-mono text-sm">
            <span className="animate-pulse">▸</span>
            <span>MANIFESTO.PROTOCOL</span>
            <span className="animate-pulse">◂</span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8">
          {/* Left Vertical Header */}
          <div className="col-span-3 flex items-center justify-center">
            <div className="relative">
              <div className="writing-vertical text-9xl font-bold text-white/5 font-mono tracking-widest">
                MANIFESTO
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent" />
            </div>
          </div>

          {/* Right Modules */}
          <div className="col-span-9 space-y-12">
            {modules.map((module, index) => (
              <div
                key={index}
                ref={el => moduleRefs.current[index] = el}
                className={`group relative transition-all duration-1000 ${
                  visibleModules.includes(index)
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-20'
                }`}
                style={{
                  transitionDelay: `${index * 200}ms`
                }}
              >
                {/* Module Container */}
                <div className={`
                  relative p-8
                  border border-${module.accentColor}-500/30
                  bg-gradient-to-br from-black/80 to-${module.accentColor}-950/20
                  backdrop-blur-sm
                  hover:border-${module.accentColor}-400/60
                  hover:shadow-2xl hover:shadow-${module.accentColor}-500/20
                  transition-all duration-500
                  ${index % 2 === 0 ? 'ml-0' : 'ml-12'}
                `}>
                  {/* Corner Decorations */}
                  <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-${module.accentColor}-400`} />
                  <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-${module.accentColor}-400`} />
                  <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-${module.accentColor}-400`} />
                  <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-${module.accentColor}-400`} />

                  {/* Left Accent Line */}
                  <div className={`
                    absolute left-0 top-0 w-1 h-full
                    bg-gradient-to-b from-transparent via-${module.accentColor}-400 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500
                  `} />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 font-mono text-xs">
                    <span className={`text-${module.accentColor}-400 animate-pulse`}>
                      {module.tag}
                    </span>
                    <span className={`text-${module.accentColor}-300 border border-${module.accentColor}-500/50 px-3 py-1`}>
                      {module.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-bold text-white mb-2 font-mono tracking-wide">
                    [ {module.title} ]
                  </h3>
                  <div className={`text-${module.accentColor}-400 text-sm font-mono mb-6 tracking-wider`}>
                    &gt;&gt; {module.subtitle}
                  </div>

                  {/* Divider */}
                  <div className={`h-px bg-gradient-to-r from-transparent via-${module.accentColor}-500/50 to-transparent mb-6`} />

                  {/* Content */}
                  <p className="text-gray-300 leading-relaxed text-lg font-light">
                    {highlightText(module.content, module.highlight, module.accentColor)}
                  </p>

                  {/* Bottom Indicator */}
                  <div className="mt-6 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${module.accentColor}-400 animate-pulse`} />
                    <div className={`h-px flex-1 bg-gradient-to-r from-${module.accentColor}-500/50 to-transparent`} />
                  </div>
                </div>

                {/* Connecting Line */}
                {index < modules.length - 1 && (
                  <div className={`
                    absolute -bottom-6 left-1/2 w-px h-12
                    bg-gradient-to-b from-${module.accentColor}-500/50 to-transparent
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-12">
          {modules.map((module, index) => (
            <div
              key={index}
              ref={el => moduleRefs.current[index] = el}
              className={`
                relative transition-all duration-1000
                ${visibleModules.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
            >
              {/* Module Container */}
              <div className={`
                relative p-6
                border border-${module.accentColor}-500/30
                bg-gradient-to-br from-black/80 to-${module.accentColor}-950/20
                backdrop-blur-sm
              `}>
                {/* Corner Decorations */}
                <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-${module.accentColor}-400`} />
                <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-${module.accentColor}-400`} />
                <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-${module.accentColor}-400`} />
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-${module.accentColor}-400`} />

                {/* Header */}
                <div className="flex flex-col gap-2 mb-4 font-mono text-xs">
                  <span className={`text-${module.accentColor}-400`}>{module.tag}</span>
                  <span className={`text-${module.accentColor}-300 border border-${module.accentColor}-500/50 px-2 py-1 self-start`}>
                    {module.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-2 font-mono">
                  [ {module.title} ]
                </h3>
                <div className={`text-${module.accentColor}-400 text-sm font-mono mb-4`}>
                  &gt;&gt; {module.subtitle}
                </div>

                {/* Divider */}
                <div className={`h-px bg-gradient-to-r from-transparent via-${module.accentColor}-500/50 to-transparent mb-4`} />

                {/* Content */}
                <p className="text-gray-300 leading-relaxed">
                  {highlightText(module.content, module.highlight, module.accentColor)}
                </p>

                {/* Bottom Indicator */}
                <div className="mt-4 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${module.accentColor}-400 animate-pulse`} />
                  <div className={`h-px flex-1 bg-gradient-to-r from-${module.accentColor}-500/50 to-transparent`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }

        .animate-float {
          animation: float linear infinite;
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }

        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        .glitch-text {
          position: relative;
          display: inline-block;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .glitch-text::before {
          left: 2px;
          text-shadow: -2px 0 #00ffff;
          clip: rect(24px, 550px, 90px, 0);
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }

        .glitch-text::after {
          left: -2px;
          text-shadow: -2px 0 #ff00ff;
          clip: rect(85px, 550px, 140px, 0);
          animation: glitch-anim 2.5s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim {
          0% { clip: rect(61px, 9999px, 90px, 0); }
          20% { clip: rect(35px, 9999px, 71px, 0); }
          40% { clip: rect(67px, 9999px, 44px, 0); }
          60% { clip: rect(28px, 9999px, 87px, 0); }
          80% { clip: rect(73px, 9999px, 34px, 0); }
          100% { clip: rect(19px, 9999px, 96px, 0); }
        }

        @keyframes glitch-anim-2 {
          0% { clip: rect(76px, 9999px, 33px, 0); }
          20% { clip: rect(12px, 9999px, 85px, 0); }
          40% { clip: rect(91px, 9999px, 28px, 0); }
          60% { clip: rect(44px, 9999px, 67px, 0); }
          80% { clip: rect(58px, 9999px, 19px, 0); }
          100% { clip: rect(23px, 9999px, 94px, 0); }
        }

        .glow-cyan {
          text-shadow: 0 0 10px rgba(34, 211, 238, 0.8);
        }

        .glow-pink {
          text-shadow: 0 0 10px rgba(236, 72, 153, 0.8);
        }

        .glow-purple {
          text-shadow: 0 0 10px rgba(168, 85, 247, 0.8);
        }
      `}</style>
    </section>
  );
};

export default NegentropySection;
