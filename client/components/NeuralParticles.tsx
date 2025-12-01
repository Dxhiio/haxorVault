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
        const nodeCount = 80;
        const connectionDistance = 200;
        const nodes: Node[] = [];

        // Neon Palette
        const COLORS = [
            { r: 0, g: 243, b: 255 },   // Cyan
            { r: 0, g: 255, b: 136 },   // Neon Green
            { r: 255, g: 0, b: 213 }    // Magenta
        ];

        class Node {
            x: number;
            y: number;
            z: number;
            vx: number;
            vy: number;
            vz: number;
            color: { r: number, g: number, b: number };
            size: number;

            constructor() {
                // Position in 3D space
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.z = Math.random() * 1000; // Depth

                // Velocity
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.vz = (Math.random() - 0.5) * 2;

                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.size = 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.z += this.vz;

                // Wrap around edges
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
                if (this.z < 0) this.z = 1000;
                if (this.z > 1000) this.z = 0;
            }

            draw() {
                if (!ctx) return;

                // Calculate perspective (closer = bigger)
                const scale = 1000 / (1000 + this.z);
                const x2d = this.x;
                const y2d = this.y;
                const size = this.size * scale * 3;
                const alpha = scale * 0.8;

                // Draw node with glow
                const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 2);
                gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`);
                gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.5})`);
                gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x2d, y2d, size * 2, 0, Math.PI * 2);
                ctx.fill();

                // Core
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
                ctx.fill();
            }

            getDistance(other: Node): number {
                const dx = this.x - other.x;
                const dy = this.y - other.y;
                const dz = this.z - other.z;
                return Math.sqrt(dx * dx + dy * dy + dz * dz);
            }
        }

        // Initialize nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node());
        }

        function drawConnections() {
            if (!ctx) return;

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const distance = nodes[i].getDistance(nodes[j]);

                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * 0.3;

                        // Calculate perspective for both nodes
                        const scale1 = 1000 / (1000 + nodes[i].z);
                        const scale2 = 1000 / (1000 + nodes[j].z);

                        // Create gradient line
                        const gradient = ctx.createLinearGradient(
                            nodes[i].x, nodes[i].y,
                            nodes[j].x, nodes[j].y
                        );

                        gradient.addColorStop(0, `rgba(${nodes[i].color.r}, ${nodes[i].color.g}, ${nodes[i].color.b}, ${opacity * scale1})`);
                        gradient.addColorStop(1, `rgba(${nodes[j].color.r}, ${nodes[j].color.g}, ${nodes[j].color.b}, ${opacity * scale2})`);

                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw connections first (behind nodes)
            drawConnections();

            // Sort nodes by z-depth (far to near) for proper layering
            nodes.sort((a, b) => b.z - a.z);

            // Update and draw nodes
            nodes.forEach(node => {
                node.update();
                node.draw();
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
            className="fixed inset-0 pointer-events-none z-0 opacity-50"
        />
    );
}
