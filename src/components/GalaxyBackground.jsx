import React, { useEffect, useRef } from 'react';

const GalaxyBackground = ({ withBlackHole = false }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let stars = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Star field
        class Star {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5;
                this.brightness = Math.random();
                this.twinkleSpeed = Math.random() * 0.01; // Slower twinkle
            }

            draw() {
                this.brightness += this.twinkleSpeed;
                if (this.brightness > 1 || this.brightness < 0) {
                    this.twinkleSpeed *= -1;
                }

                ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize
        for (let i = 0; i < 300; i++) {
            stars.push(new Star());
        }

        let time = 0;

        const animate = () => {
            time += 0.005;

            // Clear with slight trail
            ctx.fillStyle = 'rgba(5, 5, 15, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw stars
            stars.forEach(star => star.draw());

            // Draw black hole visuals
            if (withBlackHole) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                // Accretion Disk - Multi-layered for galaxy effect
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.scale(1, 0.6); // Tilt perspective

                // Outer glow
                const gradient = ctx.createRadialGradient(0, 0, 100, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
                gradient.addColorStop(0.2, 'rgba(60, 20, 100, 0.1)');
                gradient.addColorStop(0.5, 'rgba(0, 243, 255, 0.05)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(0, 0, 400, 0, Math.PI * 2);
                ctx.fill();

                // Swirling arms effect
                for (let i = 0; i < 3; i++) {
                    ctx.rotate(time * 0.5 + (i * Math.PI * 2 / 3));
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 250, 80, time, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${i === 0 ? '0, 243, 255' : i === 1 ? '188, 19, 254' : '255, 0, 153'}, 0.1)`;
                    ctx.lineWidth = 40;
                    ctx.stroke();
                }

                ctx.restore();

                // Event Horizon (Foreground)
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.scale(1, 0.6); // Match tilt

                // Event Horizon Core
                ctx.fillStyle = '#000000';
                ctx.shadowBlur = 50;
                ctx.shadowColor = '#bc13fe';
                ctx.beginPath();
                ctx.arc(0, 0, 60, 0, Math.PI * 2);
                ctx.fill();

                // Inner light ring (Photon sphere)
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 2;
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#00f3ff';
                ctx.beginPath();
                ctx.arc(0, 0, 62, 0, Math.PI * 2);
                ctx.stroke();

                ctx.restore();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [withBlackHole]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
            style={{ background: 'linear-gradient(180deg, #050515 0%, #0a0a1a 50%, #050510 100%)' }}
        />
    );
};

export default GalaxyBackground;
