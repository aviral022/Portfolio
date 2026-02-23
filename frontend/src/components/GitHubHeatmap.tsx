import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * GitHubHeatmap
 * Generates a locally-seeded contribution heatmap (no external API).
 * Displays 52 weeks × 7 days of simulated activity.
 */

const WEEKS = 52;
const DAYS = 7;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getColor(value: number): string {
    if (value === 0) return 'rgba(255,255,255,0.04)';
    if (value <= 2) return 'rgba(6,182,212,0.25)';
    if (value <= 4) return 'rgba(6,182,212,0.45)';
    if (value <= 6) return 'rgba(6,182,212,0.65)';
    return 'rgba(6,182,212,0.9)';
}

// Simple seeded pseudo-random (mulberry32)
function seededRandom(seed: number) {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export default function GitHubHeatmap() {
    const grid = useMemo(() => {
        const rng = seededRandom(2025);
        const data: number[][] = [];
        for (let w = 0; w < WEEKS; w++) {
            const week: number[] = [];
            for (let d = 0; d < DAYS; d++) {
                const r = rng();
                // ~30% no activity, rest variable up to 8
                week.push(r < 0.3 ? 0 : Math.floor(r * 9));
            }
            data.push(week);
        }
        return data;
    }, []);

    const totalContributions = useMemo(
        () => grid.flat().reduce((a, b) => a + b, 0),
        [grid]
    );

    return (
        <section className="section-container">
            <h2 className="section-heading">
                <span className="gradient-text">Contributions</span>
            </h2>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card p-6 overflow-x-auto"
            >
                {/* Total */}
                <p className="text-sm text-slate-400 mb-4">
                    <span className="text-white font-bold">{totalContributions}</span> contributions in the last year
                </p>

                <div className="flex gap-1">
                    {/* Day labels */}
                    <div className="flex flex-col gap-[3px] mr-2 pt-5">
                        {DAY_LABELS.map((label, i) => (
                            <div key={i} className="h-[13px] text-[10px] text-slate-500 flex items-center">
                                {label}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div>
                        {/* Month labels */}
                        <div className="flex mb-1">
                            {MONTH_LABELS.map((month, i) => (
                                <div
                                    key={month}
                                    className="text-[10px] text-slate-500"
                                    style={{ width: `${(WEEKS / 12) * 16}px` }}
                                >
                                    {month}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-[3px]">
                            {grid.map((week, wi) => (
                                <div key={wi} className="flex flex-col gap-[3px]">
                                    {week.map((val, di) => (
                                        <div
                                            key={di}
                                            className="w-[13px] h-[13px] rounded-sm transition-colors"
                                            style={{ backgroundColor: getColor(val) }}
                                            title={`${val} contributions`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                    <span>Less</span>
                    {[0, 2, 4, 6, 8].map((v) => (
                        <div
                            key={v}
                            className="w-[13px] h-[13px] rounded-sm"
                            style={{ backgroundColor: getColor(v) }}
                        />
                    ))}
                    <span>More</span>
                </div>
            </motion.div>
        </section>
    );
}
