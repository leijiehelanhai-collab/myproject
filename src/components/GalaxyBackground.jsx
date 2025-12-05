import React, { useEffect, useRef } from 'react';

const GalaxyBackground = ({ withBlackHole = false }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let stars = [];
        let planets = [];

        // Load planet images
        const planetImages = [
            new Image(),
            new Image(),
            new Image(),
            new Image(),
            new Image(),
            new Image(),
            new Image(),
            new Image()
        ];
        planetImages[0].src = '/assets/planets/earth.png';
        planetImages[1].src = '/assets/planets/mars.png';
        planetImages[2].src = '/assets/planets/moon.png';
        planetImages[3].src = '/assets/planets/jupiter.png';
        planetImages[4].src = '/assets/planets/venus.png';
        planetImages[5].src = '/assets/planets/mercury.png';
        planetImages[6].src = '/assets/planets/ice.png';
        planetImages[7].src = '/assets/planets/lava.png';

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

        // Planets/Celestial bodies being sucked
        class Planet {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                // Select random planet image
                this.image = planetImages[Math.floor(Math.random() * planetImages.length)];

                if (withBlackHole && !initial) {
                    // Respawn outside viewport
                    const angle = Math.random() * Math.PI * 2;
                    const maxDist = Math.max(canvas.width, canvas.height);
                    this.radius = maxDist * 0.6 + Math.random() * 300;
                    this.x = centerX + Math.cos(angle) * this.radius;
                    this.y = centerY + Math.sin(angle) * this.radius;
                    this.angle = angle;
                } else {
                    // Random distribution
                    const angle = Math.random() * Math.PI * 2;
                    const maxDist = Math.max(canvas.width, canvas.height);
                    this.radius = Math.random() * maxDist * 0.8 + 100;
                    this.x = centerX + Math.cos(angle) * this.radius;
                    this.y = centerY + Math.sin(angle) * this.radius;
                    this.angle = angle;
                }

                this.size = 15 + Math.random() * 25; // Larger size for images
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;

                // Slower speeds
                this.orbitSpeed = withBlackHole ? 0.0002 : 0;
                this.pullSpeed = withBlackHole ? 0.05 : 0; // Much slower suction
            }

            update() {
                if (withBlackHole) {
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;

                    // Pull towards center - slower acceleration
                    this.radius -= this.pullSpeed * (1 + (100 / (this.radius + 1)));

                    // Orbit
                    this.angle += this.orbitSpeed * (100 / (this.radius + 50));
                    this.rotation += this.rotationSpeed;

                    // Update position with tilt
                    const tilt = 0.7;
                    this.x = centerX + Math.cos(this.angle) * this.radius;
                    this.y = centerY + Math.sin(this.angle) * this.radius * tilt;

                    // Reset if absorbed
                    if (this.radius < 30) {
                        this.reset();
                    }
                }
            }

            draw() {
                const opacity = withBlackHole ? Math.min(1, (this.radius - 30) / 200) : 0.8;

                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);

                // Draw image if loaded, otherwise fallback to circle
                if (this.image.complete) {
                    // Create circular clip
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.clip();

                    ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
                } else {
                    ctx.fillStyle = '#4facfe';
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        // Initialize
        for (let i = 0; i < 300; i++) {
            stars.push(new Star());
        }

        // Create planets
        if (withBlackHole) {
            for (let i = 0; i < 40; i++) {
                planets.push(new Planet());
            }
        }

        let time = 0;

        const animate = () => {
            time += 0.005;

            // Clear with slight trail
            ctx.fillStyle = 'rgba(5, 5, 15, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw stars
            stars.forEach(star => star.draw());

            // Draw black hole visuals (behind planets)
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
            }

            // Draw and update planets
            planets.forEach(planet => {
                planet.update();
                planet.draw();
            });

            // Draw Event Horizon (Foreground)
            if (withBlackHole) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

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
