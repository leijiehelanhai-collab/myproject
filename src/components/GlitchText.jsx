import React, { useState, useEffect } from 'react';

const GlitchText = ({ text, className = '' }) => {
    const [displayText, setDisplayText] = useState(text);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

    useEffect(() => {
        let interval;
        let iteration = 0;

        const scramble = () => {
            interval = setInterval(() => {
                setDisplayText(prev =>
                    text
                        .split('')
                        .map((char, index) => {
                            if (index < iteration) return text[index];
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('')
                );

                if (iteration >= text.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 30);
        };

        scramble();

        // Random glitch effect occasionally
        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.8) scramble();
        }, 5000);

        return () => {
            clearInterval(interval);
            clearInterval(glitchInterval);
        };
    }, [text]);

    return (
        <span className={`font-mono ${className}`}>
            {displayText}
        </span>
    );
};

export default GlitchText;
