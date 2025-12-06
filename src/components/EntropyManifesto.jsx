import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const EntropyManifesto = () => {
  const { t } = useLanguage();
  const [visibleModules, setVisibleModules] = useState([]);
  const moduleRefs = useRef([]);

  useEffect(() => {
    const observers = moduleRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setVisibleModules((prev) => [...new Set([...prev, index])]);
              }, index * 150);
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  const modules = [
    {
      id: '01',
      status: 'CRITICAL',
      tag: t('home.entropy.module1.tag'),
      title: t('home.entropy.module1.title'),
      content: t('home.entropy.module1.content'),
      keywords: ['heat death', 'inflation', 'entropy', 'dilutes value'],
      accentColor: 'from-red-500/20 to-orange-500/20',
      borderColor: 'border-red-500/40',
      glowColor: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
      textAccent: 'text-red-400'
    },
    {
      id: '02',
      status: 'SOLUTION_FOUND',
      tag: t('home.entropy.module2.tag'),
      title: t('home.entropy.module2.title'),
      content: t('home.entropy.module2.content'),
      keywords: ['black hole', 'irreversibly', 'annihilation', 'event horizon', 'one-way'],
      accentColor: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/40',
      glowColor: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
      textAccent: 'text-cyan-400'
    },
    {
      id: '03',
      status: 'VALUE_LOCKED',
      tag: t('home.entropy.module3.tag'),
      title: t('home.entropy.module3.title'),
      content: t('home.entropy.module3.content'),
      keywords: ['singularity', 'scarcity', 'mathematically enforced', 'concentrated value', 'alchemy'],
      accentColor: 'from-pink-500/20 to-purple-500/20',
      borderColor: 'border-pink-500/40',
      glowColor: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]',
      textAccent: 'text-pink-400'
    }
  ];

  return (
    <section className="py-32 px-4 relative overflow-hidden bg-black/60">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,243,255,0.02)_50%)] bg-[size:100%_4px] pointer-events-none animate-scan"></div>

      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout: 12-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left: Vertical MANIFESTO Header (Columns 1-4) */}
          <div className="hidden lg:flex lg:col-span-3 items-center justify-center relative">
            <div className="sticky top-32">
              {/* Vertical Text */}
              <div className="relative">
                <h2
                  className="font-mono font-black text-[8rem] leading-none tracking-tighter text-white/10 select-none"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  MANIFESTO
                </h2>

                {/* Decorative Lines */}
                <div className="absolute -right-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"></div>
                <div className="absolute -right-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-pink-500/30 to-transparent"></div>

                {/* Corner Brackets */}
                <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-pink-500/50"></div>
              </div>
            </div>
          </div>

          {/* Right: Three Functional Modules (Columns 5-12) */}
          <div className="lg:col-span-9 space-y-16">

            {/* Section Header */}
            <div className="space-y-4 mb-12">
              <div className="inline-flex items-center gap-3 px-4 py-2 mb-2 rounded border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-sm font-mono text-sm text-cyan-400 tracking-[0.2em] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="font-bold tracking-widest">SYSTEM_ANALYSIS</span>
                <span className="text-white/20">|</span>
                <span className="text-pink-400 font-bold drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]">ENTROPY_ANALYSIS</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white font-mono tracking-tight">
                {t('home.entropy.section_title')}
              </h2>
            </div>

            {/* Module List - Z-shaped interlaced pattern */}
            <div className="space-y-12">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  ref={(el) => (moduleRefs.current[index] = el)}
                  className={`
                    group relative
                    ${index % 2 === 0 ? 'lg:mr-12' : 'lg:ml-12'}
                    transition-all duration-700
                    ${visibleModules.includes(index)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                    }
                  `}
                  style={{
                    animation: visibleModules.includes(index)
                      ? `glitchIn 0.6s ease-out ${index * 0.15}s`
                      : 'none'
                  }}
                >
                  {/* Module Container */}
                  <div className={`
                    relative p-8 md:p-10
                    bg-gradient-to-br ${module.accentColor}
                    border-l-4 ${module.borderColor}
                    backdrop-blur-sm
                    ${module.glowColor}
                    hover:scale-[1.02] transition-all duration-300
                    before:absolute before:inset-0 before:border before:border-white/5
                    before:border-dashed before:pointer-events-none
                  `}>

                    {/* Top Status Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="text-white/50 font-bold tracking-wider">NO.{module.id}</span>
                        <span className="text-white/30">|</span>
                        <span className={`px-3 py-1 bg-black/40 border ${module.borderColor} ${module.textAccent} tracking-wider`}>
                          [{module.status}]
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${module.textAccent.replace('text-', 'bg-')} animate-pulse`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full ${module.textAccent.replace('text-', 'bg-')} animate-pulse delay-75`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full ${module.textAccent.replace('text-', 'bg-')} animate-pulse delay-150`}></div>
                      </div>
                    </div>

                    {/* Tag */}
                    <div className={`inline-block px-4 py-1.5 mb-4 font-mono text-xs ${module.textAccent} bg-black/30 border ${module.borderColor} tracking-widest`}>
                      {'<'} {module.tag} {'>'}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight font-mono tracking-tight">
                      {module.title}
                    </h3>

                    {/* Content with increased line height */}
                    <div className="space-y-4 text-gray-300 leading-loose text-base md:text-lg">
                      {module.content.split('\n').map((paragraph, i) => (
                        <p key={i} className="relative pl-4 border-l border-white/10">
                          {highlightKeywords(paragraph, module.keywords, module.textAccent)}
                        </p>
                      ))}
                    </div>

                    {/* Bottom Decorative Line */}
                    <div className={`mt-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent`}></div>

                    {/* Corner Brackets */}
                    <div className={`absolute top-0 right-0 w-6 h-6 border-t border-r ${module.borderColor} opacity-50`}></div>
                    <div className={`absolute bottom-0 left-0 w-6 h-6 border-b border-l ${module.borderColor} opacity-50`}></div>

                    {/* Hover Glow Effect on Left Border */}
                    <div className={`
                      absolute left-0 top-0 bottom-0 w-1
                      bg-gradient-to-b from-transparent via-white to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    `}></div>
                  </div>

                  {/* Connection Line (for Z-pattern) */}
                  {index < modules.length - 1 && (
                    <div className="hidden lg:block absolute -bottom-6 left-1/2 w-px h-12 bg-gradient-to-b from-cyan-500/30 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glitchIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          20% {
            opacity: 0.3;
            transform: translateY(-5px);
          }
          40% {
            opacity: 0;
            transform: translateY(20px);
          }
          60% {
            opacity: 0.7;
            transform: translateY(0);
          }
          80% {
            opacity: 0.3;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(4px);
          }
        }

        .animate-scan {
          animation: scan 0.1s linear infinite;
        }

        .delay-75 {
          animation-delay: 75ms;
        }

        .delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </section>
  );
};

// Helper function to highlight keywords
const highlightKeywords = (text, keywords, accentClass) => {
  if (!keywords || keywords.length === 0) return text;

  // Ensure keywords is an array
  const keywordArray = Array.isArray(keywords) ? keywords : [keywords];

  // Find all keyword matches with their positions
  const matches = [];
  keywordArray.forEach((keyword) => {
    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    let index = lowerText.indexOf(lowerKeyword);

    while (index !== -1) {
      matches.push({
        start: index,
        end: index + keyword.length,
        keyword: text.substring(index, index + keyword.length)
      });
      index = lowerText.indexOf(lowerKeyword, index + 1);
    }
  });

  // If no matches found, return original text
  if (matches.length === 0) return text;

  // Sort matches by start position and remove overlaps
  matches.sort((a, b) => a.start - b.start);
  const filteredMatches = [];
  matches.forEach((match) => {
    const hasOverlap = filteredMatches.some(
      (existing) => match.start < existing.end && match.end > existing.start
    );
    if (!hasOverlap) {
      filteredMatches.push(match);
    }
  });

  // Build the result with highlighted keywords
  const parts = [];
  let lastIndex = 0;

  filteredMatches.forEach((match, i) => {
    // Add text before keyword
    if (match.start > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex, match.start)}
        </span>
      );
    }
    // Add highlighted keyword
    parts.push(
      <span
        key={`keyword-${match.start}-${i}`}
        className={`${accentClass} font-bold`}
        style={{ textShadow: '0 0 10px currentColor' }}
      >
        {match.keyword}
      </span>
    );
    lastIndex = match.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>
        {text.substring(lastIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : text;
};

export default EntropyManifesto;
