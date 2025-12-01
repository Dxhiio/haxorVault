import { useEffect, useRef } from 'react';

export default function NeuralParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        // Configuration
        const particleCount = 40; // Fewer particles for a cleaner "rare event" feel
        const particles: Particle[] = [];

        // Neon Palette
        const COLORS = [
            '0, 243, 255', // Cyan
            '0, 255, 136', // Neon Green
            '255, 0, 213'  // Magenta
        ];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            life: number;
            decay: number;
            history: { x: number, y: number }[];
            color: string;
            width: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;

                // Slower velocity for "floating" radioactive particle effect
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 0.5 + 0.2; // Reduced speed
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;

                this.life = 0; // Start invisible
                this.decay = Math.random() * 0.005 + 0.002; // Slower decay
                this.history = [];

                const baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.color = baseColor;
                this.width = Math.random() * 2 + 0.5;

                // Start with a random life to stagger spawns
                this.life = Math.random();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 0.8 + 0.3; // Slightly faster on reset but still slow
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.life = 1.0;
                this.history = [];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= this.decay;

                // Add to trail
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > 20) {
                    this.history.shift();
                }

                // Reset if dead or out of bounds
                if (this.life <= 0 || this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
                    this.reset();
                }
            }

            draw() {
                if (!ctx || this.history.length < 2) return;

                ctx.beginPath();
                ctx.moveTo(this.history[0].x, this.history[0].y);

                // Draw the trail
                for (let i = 1; i < this.history.length; i++) {
                    ctx.lineTo(this.history[i].x, this.history[i].y);
                }

                // Fade out trail
                ctx.strokeStyle = `rgba(${this.color}, ${this.life})`;
                ctx.lineWidth = this.width;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                // Add glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = `rgb(${this.color})`;

                ctx.stroke();
                ctx.shadowBlur = 0;

                // Draw head
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.life})`;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            // Create "fade" effect for trails by not fully clearing, but here we want clean trails
            // so we clear and redraw history.
            ctx.clearRect(0, 0, width, height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 opacity-40"
        />
    );
}
