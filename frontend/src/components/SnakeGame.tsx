import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPlay, FiRefreshCw } from 'react-icons/fi';

/* ── Constants ─────────────────────────────────────────────────────────── */
const CELL = 20;           // px per cell
const COLS = 20;
const ROWS = 20;
const W = COLS * CELL;
const H = ROWS * CELL;
const TICK_MS = 110;       // game speed

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Pos = { x: number; y: number };

const randomFood = (snake: Pos[]): Pos => {
    let pos: Pos;
    do {
        pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
};

/* ── Component ─────────────────────────────────────────────────────────── */
export default function SnakeGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dirRef = useRef<Dir>('RIGHT');
    const nextDirRef = useRef<Dir>('RIGHT');

    const [snake, setSnake] = useState<Pos[]>([{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }]);
    const [food, setFood] = useState<Pos>({ x: 12, y: 10 });
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('snake_highscore');
        return saved ? parseInt(saved, 10) : 0;
    });
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);

    /* ── Draw ───────────────────────────────────────────────────────────── */
    const draw = useCallback((snakeArr: Pos[], foodPos: Pos) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        // Background
        ctx.fillStyle = 'rgba(6, 6, 20, 0.92)';
        ctx.fillRect(0, 0, W, H);

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= W; x += CELL) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y <= H; y += CELL) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // Food (glowing dot)
        const fx = foodPos.x * CELL + CELL / 2;
        const fy = foodPos.y * CELL + CELL / 2;
        const glow = ctx.createRadialGradient(fx, fy, 2, fx, fy, CELL);
        glow.addColorStop(0, 'rgba(236, 72, 153, 0.9)');
        glow.addColorStop(0.5, 'rgba(236, 72, 153, 0.3)');
        glow.addColorStop(1, 'rgba(236, 72, 153, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(foodPos.x * CELL - CELL / 2, foodPos.y * CELL - CELL / 2, CELL * 2, CELL * 2);
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(fx, fy, CELL / 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Snake
        snakeArr.forEach((seg, i) => {
            const t = 1 - i / snakeArr.length;
            const r = Math.round(6 + (6 - 6) * t);
            const g = Math.round(182 + (182 - 182) * t);
            const b = Math.round(212 + (212 - 212) * t);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.4 + t * 0.6})`;
            ctx.shadowColor = i === 0 ? 'rgba(6, 182, 212, 0.5)' : 'transparent';
            ctx.shadowBlur = i === 0 ? 12 : 0;
            const pad = i === 0 ? 1 : 2;
            ctx.beginPath();
            ctx.roundRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 4);
            ctx.fill();
        });
        ctx.shadowBlur = 0;

        // Border
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, W, H);
    }, []);

    /* ── Game tick ──────────────────────────────────────────────────────── */
    useEffect(() => {
        if (!started || gameOver) return;

        const interval = setInterval(() => {
            setSnake(prev => {
                dirRef.current = nextDirRef.current;
                const head = { ...prev[0] };
                switch (dirRef.current) {
                    case 'UP': head.y -= 1; break;
                    case 'DOWN': head.y += 1; break;
                    case 'LEFT': head.x -= 1; break;
                    case 'RIGHT': head.x += 1; break;
                }

                // Wall collision
                if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
                    setGameOver(true);
                    return prev;
                }

                // Self collision
                if (prev.some(s => s.x === head.x && s.y === head.y)) {
                    setGameOver(true);
                    return prev;
                }

                const newSnake = [head, ...prev];

                // Eating food
                if (head.x === food.x && head.y === food.y) {
                    setScore(s => {
                        const newScore = s + 10;
                        setHighScore(hs => {
                            const best = Math.max(hs, newScore);
                            localStorage.setItem('snake_highscore', String(best));
                            return best;
                        });
                        return newScore;
                    });
                    setFood(randomFood(newSnake));
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        }, TICK_MS);

        return () => clearInterval(interval);
    }, [started, gameOver, food]);

    /* ── Redraw on state change ─────────────────────────────────────────── */
    useEffect(() => {
        draw(snake, food);
    }, [snake, food, draw]);

    /* ── Keyboard controls ──────────────────────────────────────────────── */
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            const cur = dirRef.current;
            switch (e.key) {
                case 'ArrowUp': case 'w': case 'W': if (cur !== 'DOWN') nextDirRef.current = 'UP'; break;
                case 'ArrowDown': case 's': case 'S': if (cur !== 'UP') nextDirRef.current = 'DOWN'; break;
                case 'ArrowLeft': case 'a': case 'A': if (cur !== 'RIGHT') nextDirRef.current = 'LEFT'; break;
                case 'ArrowRight': case 'd': case 'D': if (cur !== 'LEFT') nextDirRef.current = 'RIGHT'; break;
            }
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    /* ── Touch controls for mobile ──────────────────────────────────────── */
    const touchStart = useRef<{ x: number; y: number } | null>(null);

    const onTouchStart = (e: React.TouchEvent) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart.current) return;
        const dx = e.changedTouches[0].clientX - touchStart.current.x;
        const dy = e.changedTouches[0].clientY - touchStart.current.y;
        const cur = dirRef.current;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 20 && cur !== 'LEFT') nextDirRef.current = 'RIGHT';
            if (dx < -20 && cur !== 'RIGHT') nextDirRef.current = 'LEFT';
        } else {
            if (dy > 20 && cur !== 'UP') nextDirRef.current = 'DOWN';
            if (dy < -20 && cur !== 'DOWN') nextDirRef.current = 'UP';
        }
        touchStart.current = null;
    };

    /* ── Reset ─────────────────────────────────────────────────────────── */
    const resetGame = () => {
        const initial = [{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }];
        setSnake(initial);
        setFood(randomFood(initial));
        setScore(0);
        setGameOver(false);
        setStarted(true);
        dirRef.current = 'RIGHT';
        nextDirRef.current = 'RIGHT';
    };

    /* ── Render ─────────────────────────────────────────────────────────── */
    return (
        <section className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 py-20">
            {/* Back link */}
            <motion.a
                href="/"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
                <FiArrowLeft /> Back to Portfolio
            </motion.a>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
            >
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-2">
                    <span className="gradient-text">🐍 Snake Game</span>
                </h1>
                <p className="text-slate-400 text-sm">Use arrow keys or WASD to play • Swipe on mobile</p>
            </motion.div>

            {/* Scoreboard */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-6 mb-6"
            >
                <div className="glass-card px-6 py-3 text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Score</div>
                    <div className="text-2xl font-bold text-cyan-400">{score}</div>
                </div>
                <div className="glass-card px-6 py-3 text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Best</div>
                    <div className="text-2xl font-bold text-purple-400">{highScore}</div>
                </div>
            </motion.div>

            {/* Game canvas */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative glass-card p-3 sm:p-4"
                style={{ lineHeight: 0 }}
            >
                <canvas
                    ref={canvasRef}
                    width={W}
                    height={H}
                    className="rounded-lg"
                    style={{ maxWidth: '100%', height: 'auto' }}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                />

                {/* Overlays */}
                {!started && !gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-2xl">
                        <button
                            onClick={() => setStarted(true)}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-cyan-500/25"
                        >
                            <FiPlay /> Start Game
                        </button>
                    </div>
                )}

                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-2xl gap-4">
                        <div className="text-3xl font-extrabold text-red-400">Game Over!</div>
                        <div className="text-lg text-slate-300">Score: <span className="text-cyan-400 font-bold">{score}</span></div>
                        <button
                            onClick={resetGame}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-cyan-500/25"
                        >
                            <FiRefreshCw /> Play Again
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Mobile controls */}
            <div className="mt-6 grid grid-cols-3 gap-2 md:hidden" style={{ width: 180 }}>
                <div />
                <button onClick={() => { if (dirRef.current !== 'DOWN') nextDirRef.current = 'UP'; }} className="glass-card p-3 text-center text-xl text-cyan-400 active:scale-90 transition-transform">▲</button>
                <div />
                <button onClick={() => { if (dirRef.current !== 'RIGHT') nextDirRef.current = 'LEFT'; }} className="glass-card p-3 text-center text-xl text-cyan-400 active:scale-90 transition-transform">◀</button>
                <button onClick={() => { if (dirRef.current !== 'UP') nextDirRef.current = 'DOWN'; }} className="glass-card p-3 text-center text-xl text-cyan-400 active:scale-90 transition-transform">▼</button>
                <button onClick={() => { if (dirRef.current !== 'LEFT') nextDirRef.current = 'RIGHT'; }} className="glass-card p-3 text-center text-xl text-cyan-400 active:scale-90 transition-transform">▶</button>
            </div>
        </section>
    );
}
