import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Challenge definitions ─────────────────────────────────────────────── */
type ChallengeId = 'fizzbuzz' | 'duplicate' | 'logic';

interface Challenge {
    id: ChallengeId;
    title: string;
    emoji: string;
    description: string;
    placeholder: string;
    inputLabel: string;
}

const CHALLENGES: Challenge[] = [
    {
        id: 'fizzbuzz',
        title: 'FizzBuzz',
        emoji: '🔢',
        description:
            'Classic FizzBuzz — print numbers from 1 to n. Replace multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz".',
        placeholder: 'Enter a number (e.g. 20)',
        inputLabel: 'Number n',
    },
    {
        id: 'duplicate',
        title: 'Find Duplicate',
        emoji: '🔍',
        description:
            'Given a list of comma-separated numbers, find the first duplicate value. If none exists, return "No duplicates found".',
        placeholder: 'e.g. 3, 1, 4, 1, 5, 9',
        inputLabel: 'Numbers',
    },
    {
        id: 'logic',
        title: 'Logic Puzzle',
        emoji: '🧩',
        description:
            'What is the missing number in the sequence? Each number is the sum of the previous two.\n\n2, 3, 5, 8, 13, ?, 34',
        placeholder: 'Enter the missing number',
        inputLabel: 'Your Answer',
    },
];

/* ── Solvers ───────────────────────────────────────────────────────────── */
function solveFizzBuzz(input: string): string {
    const n = parseInt(input.trim(), 10);
    if (isNaN(n) || n < 1 || n > 200) return '⚠️ Please enter a valid number between 1 and 200.';
    const lines: string[] = [];
    for (let i = 1; i <= n; i++) {
        if (i % 15 === 0) lines.push('FizzBuzz');
        else if (i % 3 === 0) lines.push('Fizz');
        else if (i % 5 === 0) lines.push('Buzz');
        else lines.push(String(i));
    }
    return lines.join(', ');
}

function solveDuplicate(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return '⚠️ Please enter some numbers.';
    const nums = trimmed.split(',').map(s => s.trim());
    const seen = new Set<string>();
    for (const num of nums) {
        if (seen.has(num)) return `✅ Duplicate found: ${num}`;
        seen.add(num);
    }
    return '✨ No duplicates found!';
}

function solveLogic(input: string): string {
    const answer = parseInt(input.trim(), 10);
    if (isNaN(answer)) return '⚠️ Please enter a valid number.';
    if (answer === 21) return '🎉 Correct! 8 + 13 = 21. Impressive!';
    return `❌ Not quite. Hint: add the two numbers before the gap (8 + 13).`;
}

const SOLVERS: Record<ChallengeId, (input: string) => string> = {
    fizzbuzz: solveFizzBuzz,
    duplicate: solveDuplicate,
    logic: solveLogic,
};

/* ── Component ─────────────────────────────────────────────────────────── */
export default function CodeBattle() {
    const [activeId, setActiveId] = useState<ChallengeId>('fizzbuzz');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<string | null>(null);

    const active = CHALLENGES.find(c => c.id === activeId)!;

    const handleRun = () => {
        setOutput(SOLVERS[activeId](input));
    };

    const switchChallenge = (id: ChallengeId) => {
        setActiveId(id);
        setInput('');
        setOutput(null);
    };

    return (
        <section id="code-battle" className="section-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
            >
                <h2 className="section-heading" style={{ marginBottom: '0.5rem' }}>
                    <span className="gradient-text">🎮 Code Battle: Try to Beat My Logic</span>
                </h2>
                <p className="text-lg text-slate-400 mb-1">Think you can solve it faster?</p>
                <p className="text-xs text-slate-600 italic">Built for fun. Logic always wins.</p>
            </motion.div>

            {/* ── Challenge tabs ──────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="cb-tabs"
            >
                {CHALLENGES.map(ch => (
                    <button
                        key={ch.id}
                        onClick={() => switchChallenge(ch.id)}
                        className={`cb-tab ${ch.id === activeId ? 'cb-tab-active' : ''}`}
                    >
                        <span className="cb-tab-emoji">{ch.emoji}</span>
                        {ch.title}
                    </button>
                ))}
            </motion.div>

            {/* ── Challenge card ──────────────────────────────────── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeId}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="cb-card"
                >
                    {/* Problem statement */}
                    <p className="cb-description">{active.description}</p>

                    {/* Input */}
                    <label className="cb-input-label">{active.inputLabel}</label>
                    <div className="cb-input-row">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder={active.placeholder}
                            className="cb-input"
                            onKeyDown={e => e.key === 'Enter' && handleRun()}
                        />
                        <button onClick={handleRun} className="cb-run-btn">
                            ▶ Run
                        </button>
                    </div>

                    {/* Output */}
                    <AnimatePresence>
                        {output && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="cb-output"
                            >
                                <span className="cb-output-label">Output</span>
                                <pre className="cb-output-text">{output}</pre>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </section>
    );
}
