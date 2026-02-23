import { useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   GalaxyBackground — Canvas-based starfield with parallax and twinkling
   ═══════════════════════════════════════════════════════════════════════════
   • Multiple star layers for depth (parallax)
   • Gentle twinkling via alpha oscillation
   • Slow drift movement
   • Nebula glow patches for galaxy feel
   • 60fps optimized with requestAnimationFrame
   ═══════════════════════════════════════════════════════════════════════════ */

interface Star {
    x: number;
    y: number;
    z: number;          // depth layer (0–1), controls size + speed
    radius: number;
    baseAlpha: number;
    twinkleSpeed: number;
    twinkleOffset: number;
    color: string;
}

/* Color palette for stars — whites, blues, purples, pinks */
const STAR_COLORS = [
    '255,255,255',   // white
    '255,255,255',   // white (weighted)
    '200,220,255',   // cool blue-white
    '180,200,255',   // soft blue
    '6,182,212',     // cyan accent
    '168,85,247',    // purple accent
    '220,180,255',   // lavender
];

/* Nebula glow patches */
interface Nebula {
    x: number;
    y: number;
    radius: number;
    color: string;
    alpha: number;
    driftX: number;
    driftY: number;
}

const STAR_COUNT = 280;
const NEBULA_COUNT = 4;

export default function GalaxyBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        /* ── Sizing ──────────────────────────────────────────────────── */
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        resize();
        window.addEventListener('resize', resize);

        /* ── Generate stars ──────────────────────────────────────────── */
        const stars: Star[] = Array.from({ length: STAR_COUNT }, () => {
            const z = Math.random();
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                z,
                radius: 0.3 + z * 1.8,
                baseAlpha: 0.2 + Math.random() * 0.6,
                twinkleSpeed: 0.3 + Math.random() * 2.0,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
            };
        });

        /* ── Generate nebula patches ─────────────────────────────────── */
        const nebulae: Nebula[] = Array.from({ length: NEBULA_COUNT }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 200 + Math.random() * 300,
            color: [
                '6,182,212',    // cyan
                '168,85,247',   // purple
                '236,72,153',   // pink
                '99,102,241',   // indigo
            ][Math.floor(Math.random() * 4)],
            alpha: 0.015 + Math.random() * 0.025,
            driftX: (Math.random() - 0.5) * 0.15,
            driftY: (Math.random() - 0.5) * 0.1,
        }));

        /* ── Animation loop ──────────────────────────────────────────── */
        let time = 0;

        const animate = () => {
            time += 0.016; // ~60fps timestep
            ctx.clearRect(0, 0, width, height);

            /* Draw nebula glow patches */
            for (const neb of nebulae) {
                neb.x += neb.driftX;
                neb.y += neb.driftY;

                // Wrap around screen edges
                if (neb.x < -neb.radius) neb.x = width + neb.radius;
                if (neb.x > width + neb.radius) neb.x = -neb.radius;
                if (neb.y < -neb.radius) neb.y = height + neb.radius;
                if (neb.y > height + neb.radius) neb.y = -neb.radius;

                const gradient = ctx.createRadialGradient(
                    neb.x, neb.y, 0,
                    neb.x, neb.y, neb.radius
                );
                gradient.addColorStop(0, `rgba(${neb.color},${neb.alpha * 1.5})`);
                gradient.addColorStop(0.5, `rgba(${neb.color},${neb.alpha * 0.5})`);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.arc(neb.x, neb.y, neb.radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            /* Draw stars with twinkling + parallax drift */
            for (const star of stars) {
                // Parallax drift — deeper stars move slower
                const speed = 0.05 + star.z * 0.15;
                star.x -= speed * 0.3;
                star.y += speed * 0.15;

                // Wrap around
                if (star.x < -2) star.x = width + 2;
                if (star.y > height + 2) star.y = -2;

                // Twinkling alpha oscillation
                const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
                const alpha = star.baseAlpha + twinkle * 0.3;

                // Draw star with glow
                if (star.z > 0.6) {
                    // Brighter stars get a soft glow
                    const glowRadius = star.radius * 3;
                    const glow = ctx.createRadialGradient(
                        star.x, star.y, 0,
                        star.x, star.y, glowRadius
                    );
                    glow.addColorStop(0, `rgba(${star.color},${alpha * 0.4})`);
                    glow.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
                    ctx.fillStyle = glow;
                    ctx.fill();
                }

                // Core dot
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${star.color},${Math.max(0, Math.min(1, alpha))})`;
                ctx.fill();
            }

            animFrameRef.current = requestAnimationFrame(animate);
        };

        animFrameRef.current = requestAnimationFrame(animate);

        /* ── Cleanup ─────────────────────────────────────────────────── */
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
            aria-hidden="true"
        />
    );
}
