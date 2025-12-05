import React from 'react';

const MechaButton = ({ children, onClick, className = '', variant = 'primary' }) => {
    const baseStyles = "relative px-8 py-4 font-bold text-lg tracking-widest uppercase transition-all duration-300 group overflow-hidden";

    const variants = {
        primary: "bg-neon-blue/10 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue hover:text-black hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]",
        secondary: "bg-transparent text-white border border-white/20 hover:border-white/50 hover:bg-white/5",
        danger: "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-black hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} mecha-btn ${className}`}
        >
            {/* Holographic Scanline Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-50"></div>

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
};

export default MechaButton;
