import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const EntropySection = ({ t }) => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

    // Module data
    const modules = [
        {
            id: 'module1',
            tag: t('entropy.module1.tag'),
            logId: 'LOG_ENTRY_001',
            status: 'CRITICAL',
            statusColor: 'text-red-500',
            title: t('entropy.module1.title'),
            content: t('entropy.module1.content'),
            keywords: t('entropy.module1.keywords'),
            accentColor: 'cyan',
            delay: 0.2
        },
        {
            id: 'module2',
            tag: t('entropy.module2.tag'),
            logId: 'LOG_ENTRY_002',
            status: 'ACTIVE',
            statusColor: 'text-green-500',
            title: t('entropy.module2.title'),
            content: t('entropy.module2.content'),
            keywords: t('entropy.module2.keywords'),
            accentColor: 'pink',
            delay: 0.4
        },
        {
            id: 'module3',
            tag: t('entropy.module3.tag'),
            logId: 'LOG_ENTRY_003',
            status: 'OPTIMAL',
            statusColor: 'text-purple-500',
            title: t('entropy.module3.title'),
            content: t('entropy.module3.content'),
            keywords: t('entropy.module3.keywords'),
            accentColor: 'yellow',
            delay: 0.6
        }
    ];

    // Highlight keywords in content
    const highlightKeywords = (text, keywords, accentColor) => {
        if (!keywords || keywords.length === 0) return text;

        let highlightedText = text;
        const colorMap = {
            cyan: 'text-cyan-400',
            pink: 'text-pink-500',
            yellow: 'text-yellow-400'
        };

        keywords.forEach(keyword => {
            const regex = new RegExp(`(${keyword})`, 'gi');
            highlightedText = highlightedText.replace(
                regex,
                `<span class="${colorMap[accentColor]} font-semibold glow-text">$1</span>`
            );
        });

        return highlightedText;
    };

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen bg-black py-20 px-4 md:px-8 overflow-hidden"
        >
            {/* Background grid effect */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute inset-0 animate-scan" style={{
                    background: 'linear-gradient(transparent 50%, rgba(0, 255, 255, 0.5) 50%)',
                    backgroundSize: '100% 4px'
                }} />
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Desktop Layout: 12-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">

                    {/* Left: Vertical MANIFESTO Header (Columns 1-4) */}
                    <div className="hidden md:flex md:col-span-4 items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={isInView ? { opacity: 0.1, x: 0 } : { opacity: 0, x: -50 }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            {/* Vertical stacked text */}
                            <div className="flex flex-col items-center space-y-0">
                                {['M', 'A', 'N', 'I', 'F', 'E', 'S', 'T', 'O'].map((letter, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isInView ? { opacity: 0.1, y: 0 } : { opacity: 0, y: 20 }}
                                        transition={{ delay: i * 0.05, duration: 0.5 }}
                                        className="text-8xl font-black text-white tracking-wider"
                                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Decorative brackets */}
                            <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-cyan-500 opacity-30">
                                <span className="text-4xl">[</span>
                                <span className="text-4xl">]</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Three Modules (Columns 5-12) */}
                    <div className="md:col-span-8 space-y-12 md:space-y-16">

                        {/* Section Title */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                            transition={{ duration: 0.8 }}
                            className="mb-16"
                        >
                            <div className="font-mono text-xs text-cyan-500 mb-2">
                                {'// SYSTEM_PROTOCOL'}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                {t('entropy.section_title')}
                            </h2>
                            <div className="mt-4 h-px bg-gradient-to-r from-cyan-500 via-purple-500 to-transparent" />
                        </motion.div>

                        {/* Modules */}
                        {modules.map((module, index) => (
                            <ModuleCard
                                key={module.id}
                                module={module}
                                index={index}
                                isInView={isInView}
                                highlightKeywords={highlightKeywords}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom CSS for glow effect */}
            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .animate-scan {
                    animation: scan 8s linear infinite;
                }
                .glow-text {
                    text-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
                }
                @keyframes glitch {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .glitch-enter {
                    animation: glitch 0.3s ease-in-out;
                }
            `}</style>
        </section>
    );
};

// Individual Module Card Component
const ModuleCard = ({ module, index, isInView, highlightKeywords }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [hasGlitched, setHasGlitched] = useState(false);
    const cardRef = useRef(null);
    const cardInView = useInView(cardRef, { once: true, margin: "-50px" });

    // Trigger glitch effect when card comes into view
    useEffect(() => {
        if (cardInView && !hasGlitched) {
            setHasGlitched(true);
        }
    }, [cardInView, hasGlitched]);

    const accentColorMap = {
        cyan: {
            border: 'border-cyan-500',
            text: 'text-cyan-400',
            glow: 'shadow-cyan-500/50'
        },
        pink: {
            border: 'border-pink-500',
            text: 'text-pink-500',
            glow: 'shadow-pink-500/50'
        },
        yellow: {
            border: 'border-yellow-500',
            text: 'text-yellow-400',
            glow: 'shadow-yellow-500/50'
        }
    };

    const colors = accentColorMap[module.accentColor];

    // Z-pattern offset for desktop
    const offsetClass = index % 2 === 0 ? 'md:mr-12' : 'md:ml-12';

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: module.delay, duration: 0.8 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative group ${offsetClass} ${hasGlitched ? 'glitch-enter' : ''}`}
        >
            {/* Module Container */}
            <div className={`
                relative border ${colors.border} border-opacity-30
                bg-black bg-opacity-50 backdrop-blur-sm
                p-6 md:p-8
                transition-all duration-300
                ${isHovered ? `${colors.glow} shadow-2xl border-opacity-100` : ''}
            `}>

                {/* Top decorative line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-50"
                     style={{ color: colors.border.replace('border-', '') }} />

                {/* Left accent border (lights up on hover) */}
                <motion.div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${colors.border.replace('border-', 'bg-')}`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'top' }}
                />

                {/* Header: Log ID and Status */}
                <div className="flex items-center justify-between mb-4 font-mono text-xs">
                    <span className={`${colors.text} opacity-70`}>
                        {'// '}{module.logId}
                    </span>
                    <span className={`${module.statusColor} flex items-center gap-2`}>
                        <span className={`w-2 h-2 rounded-full ${module.statusColor.replace('text-', 'bg-')} animate-pulse`} />
                        {'[SYSTEM_STATUS: '}{module.status}{']'}
                    </span>
                </div>

                {/* Tag */}
                <div className={`inline-block px-3 py-1 mb-4 border ${colors.border} ${colors.text} font-mono text-xs tracking-wider`}>
                    {'<'}{module.tag}{' />'}
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight leading-tight">
                    {module.title}
                </h3>

                {/* Content with highlighted keywords */}
                <div
                    className="text-gray-300 leading-relaxed space-y-4 font-light text-sm md:text-base"
                    style={{ lineHeight: '1.8' }}
                    dangerouslySetInnerHTML={{
                        __html: highlightKeywords(module.content, module.keywords, module.accentColor)
                            .split('\n\n')
                            .map(para => `<p>${para}</p>`)
                            .join('')
                    }}
                />

                {/* Bottom decorative corners */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-current opacity-30"
                     style={{ color: colors.border.replace('border-', '') }} />
                <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-current opacity-30"
                     style={{ color: colors.border.replace('border-', '') }} />
            </div>

            {/* Hover glow effect */}
            {isHovered && (
                <motion.div
                    className={`absolute inset-0 ${colors.border.replace('border-', 'bg-')} opacity-5 blur-xl -z-10`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ duration: 0.3 }}
                />
            )}
        </motion.div>
    );
};

export default EntropySection;
