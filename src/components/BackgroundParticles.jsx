import React, { useEffect, useRef } from 'react';

const BackgroundParticles = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Configuration
        const particleCount = Math.min(Math.floor(window.innerWidth / 15), 70);

        // Extended Crypto Definitions
        const cryptoTypes = [
            // Majors
            { type: 'BTC', color: '#F7931A', symbol: '₿', shape: 'circle' },
            { type: 'ETH', color: '#627EEA', symbol: 'Ξ', shape: 'diamond' },
            { type: 'BNB', color: '#F0B90B', symbol: '❖', shape: 'square' },
            { type: 'SOL', color: '#14F195', symbol: 'S', shape: 'circle' },
            { type: 'XRP', color: '#FFFFFF', symbol: '✕', shape: 'diamond' }, // White X

            // Stablecoins
            { type: 'USDT', color: '#26A17B', symbol: '₮', shape: 'circle' },
            { type: 'USDC', color: '#2775CA', symbol: '$', shape: 'circle' },

            // Memes
            { type: 'DOGE', color: '#C2A633', symbol: 'Ð', shape: 'circle' },
            { type: 'PEPE', color: '#4CAF50', symbol: '🐸', shape: 'circle' },

            // Exchanges
            { type: 'BINANCE', color: '#F0B90B', symbol: '◆', shape: 'diamond' },
            { type: 'OKX', color: '#000000', symbol: 'OKX', shape: 'rect' },
            { type: 'GATE', color: '#0D8558', symbol: 'G', shape: 'rect' } // Gate.io
        ];

        class CryptoParticle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 100;

                // 3D Depth Effect
                this.z = Math.random(); // 0 (far) to 1 (near)
                this.scale = 0.5 + this.z * 0.8; // Size multiplier

                this.speed = (Math.random() * 1.5 + 0.5) * this.scale;
                this.baseSize = 25;
                this.size = this.baseSize * this.scale;

                this.data = cryptoTypes[Math.floor(Math.random() * cryptoTypes.length)];
                this.opacity = 0;
                this.fadeIn = true;
                this.maxOpacity = (Math.random() * 0.5 + 0.3) * this.scale; // Closer = brighter

                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.03;

                this.glitchTimer = 0;
            }

            update() {
                this.y -= this.speed;
                this.rotation += this.rotationSpeed;

                // Fade in
                if (this.fadeIn) {
                    this.opacity += 0.02;
                    if (this.opacity >= this.maxOpacity) this.fadeIn = false;
                }

                // "Incinerator" Effect: Top of screen burn/fade
                if (this.y < 150) {
                    this.opacity -= 0.015;
                    // Glitch/Shake as it burns
                    if (Math.random() < 0.2) {
                        this.x += (Math.random() - 0.5) * 5;
                    }
                }

                // Reset
                if (this.y < -50 || this.opacity <= 0) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.scale(this.scale, this.scale); // Apply depth scale

                // Data Trail (Speed lines)
                if (this.speed > 1.0) {
                    const trailLength = this.speed * 20;
                    const gradient = ctx.createLinearGradient(0, 0, 0, trailLength);
                    gradient.addColorStop(0, this.data.color);
                    gradient.addColorStop(1, 'transparent');

                    ctx.fillStyle = gradient;
                    ctx.globalAlpha = this.opacity * 0.3;
                    ctx.beginPath();
                    ctx.rect(-2, 0, 4, trailLength);
                    ctx.fill();
                }

                // Rotate Icon
                ctx.rotate(this.rotation);
                ctx.globalAlpha = Math.max(0, this.opacity);

                const half = this.baseSize / 2;

                // Glow - Stronger for near particles
                ctx.shadowBlur = 15 * this.z;
                ctx.shadowColor = this.data.color;

                // Draw Shape Background
                ctx.fillStyle = this.data.type === 'OKX' ? '#000' : this.data.color;
                if (this.data.type === 'XRP') ctx.fillStyle = '#333'; // Dark grey for XRP bg to show white X

                ctx.beginPath();
                if (this.data.shape === 'circle') {
                    ctx.arc(0, 0, half, 0, Math.PI * 2);
                } else if (this.data.shape === 'square') {
                    ctx.roundRect(-half, -half, this.baseSize, this.baseSize, 4);
                } else if (this.data.shape === 'rect') {
                    ctx.roundRect(-half * 1.6, -half, this.baseSize * 1.6, this.baseSize, 4);
                } else if (this.data.shape === 'diamond') {
                    ctx.moveTo(0, -half);
                    ctx.lineTo(half, 0);
                    ctx.lineTo(0, half);
                    ctx.lineTo(-half, 0);
                    ctx.closePath();
                }
                ctx.fill();

                // Draw Symbol/Text
                ctx.fillStyle = (['BINANCE', 'BNB', 'DOGE'].includes(this.data.type)) ? '#000' : '#FFF';

                ctx.font = `bold ${this.baseSize * 0.5}px "Orbitron", sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Crisp text
                ctx.shadowBlur = 0;

                // Rotate text back slightly to be readable? No, spinning coins is better.
                ctx.fillText(this.data.symbol, 0, 0);

                // Border for OKX/Gate/XRP
                if (['OKX', 'GATE', 'XRP'].includes(this.data.type)) {
                    ctx.strokeStyle = this.data.color;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                ctx.restore();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new CryptoParticle());
            }
        };

        init();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Sort by Z for proper layering (far items drawn first)
            particles.sort((a, b) => a.z - b.z);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
            style={{ opacity: 0.8 }}
        />
    );
};

export default BackgroundParticles;
