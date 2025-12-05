import React, { useMemo } from 'react';

const BlackHole = () => {
    // Generate particles with varying properties for acceleration effect
    const particles = useMemo(() => (
        new Array(40).fill(0).map((_, i) => ({
            angle: (i * 360) / 40,
            distance: 180 + Math.random() * 120,
            size: 2 + Math.random() * 3,
            duration: 3 + Math.random() * 4,
            delay: -Math.random() * 4
        }))
    ), []);

    return (
        <div className="relative flex items-center justify-center w-full h-96 md:h-[500px] overflow-hidden">
            {/* Gravitational Lensing Effect - Radial Distortion */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_30%,rgba(0,243,255,0.03)_50%,rgba(0,0,0,0.8)_100%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.1)_0%,transparent_40%)]" style={{ filter: 'blur(60px)' }}></div>
            </div>

            {/* Event Horizon (The Black Hole Core) */}
            <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                {/* Outer Glow Rings */}
                <div className="absolute -inset-12 md:-inset-20 rounded-full bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-neon-hotpink/20 blur-3xl animate-pulse"></div>

                {/* Accretion Disk - Multi-layer */}
                <div className="absolute -inset-6 md:-inset-10 rounded-full border-[8px] md:border-[12px] border-t-neon-cyan border-r-neon-purple border-b-neon-hotpink border-l-transparent blur-sm animate-[spin_20s_linear_infinite] opacity-70"></div>
                <div className="absolute -inset-8 md:-inset-14 rounded-full border-[4px] md:border-[6px] border-t-transparent border-r-neon-cyan border-b-transparent border-l-neon-hotpink blur-md animate-[spin_15s_linear_infinite_reverse] opacity-50"></div>
                <div className="absolute -inset-10 md:-inset-18 rounded-full border-[2px] border-white/10 animate-[spin_25s_linear_infinite] opacity-30"></div>

                {/* Black Hole Core with Gravitational Lens Effect */}
                <div className="relative w-full h-full bg-black rounded-full shadow-[0_0_80px_rgba(0,0,0,1),inset_0_0_60px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden">
                    {/* Inner Singularity Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.3)_0%,rgba(188,19,254,0.2)_30%,transparent_60%)] animate-pulse"></div>

                    {/* Distortion Effect */}
                    <div className="absolute inset-0 rounded-full" style={{
                        background: 'radial-gradient(circle at 40% 40%, rgba(0,243,255,0.15), transparent 50%)',
                        filter: 'blur(20px)',
                        animation: 'float 8s ease-in-out infinite'
                    }}></div>

                    {/* Core Void */}
                    <div className="w-20 h-20 md:w-28 md:h-28 bg-black rounded-full shadow-[inset_0_0_30px_rgba(0,0,0,1)] z-10"></div>
                </div>
            </div>

            {/* Enhanced Particle System with Acceleration */}
            <div className="absolute inset-0 pointer-events-none z-20">
                {particles.map((particle, i) => (
                    <div
                        key={i}
                        className="absolute top-1/2 left-1/2 rounded-full bg-gradient-to-r from-neon-cyan to-white shadow-[0_0_4px_rgba(0,243,255,0.8)]"
                        style={{
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            transform: `rotate(${particle.angle}deg) translateX(${particle.distance}px)`,
                            animation: `particle-accelerate ${particle.duration}s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                            animationDelay: `${particle.delay}s`,
                            opacity: 0.7
                        }}
                    ></div>
                ))}
            </div>

            {/* Lens Flare Effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none z-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,243,255,0.1)_0%,transparent_70%)] animate-pulse"></div>
            </div>
        </div>
    );
};

export default BlackHole;
