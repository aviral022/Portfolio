import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiChevronDown, FiDownload } from 'react-icons/fi';

/* ── Rotating role titles ───────────────────────────────────────────────── */
const ROLES = [
    'Data Analyst',
    'Applied AI Engineer',
    'Full-Stack Developer',
    'ML Engineer',
];

/* ── Professional description points ────────────────────────────────────── */
const BIO_POINTS = [
    'Information Technology graduate from one of India\'s top universities, with a strong academic record (GPA 10.0).',
    'Deep expertise in Machine Learning, NLP, and AI-powered systems - from model design to production deployment.',
    'Built real-time fraud detection platforms and predictive ML models that solve critical business problems.',
    'Developed an intelligent AI chatbot with both online and offline modes for seamless user interaction.',
    'Full-stack developer (React + FastAPI) passionate about building scalable, end-to-end software solutions.',
];

/* ── Fade-in animation variants ─────────────────────────────────────────── */
const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.6 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function Hero() {
    const [roleIndex, setRoleIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <section
            id="hero"
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
        >
            <div className="section-container text-center max-w-4xl mx-auto">

                {/* ── Greeting chip ──────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8"
                >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Available for opportunities
                </motion.div>

                {/* ── Name with glow ─────────────────────────────────── */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight hero-name"
                >
                    <span className="gradient-text hero-glow">Aviral Dubey</span>
                </motion.h1>

                {/* ── Rotating role ──────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="h-10 sm:h-12 flex items-center justify-center mb-10 overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={roleIndex}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -30, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-xl sm:text-2xl font-semibold text-purple-400"
                        >
                            {ROLES[roleIndex]}
                        </motion.span>
                    </AnimatePresence>
                </motion.div>

                {/* ── Professional description in glassmorphism card ── */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="hero-bio-card mx-auto mb-10 max-w-2xl"
                >
                    <ul className="space-y-3 text-left">
                        {BIO_POINTS.map((point, i) => (
                            <motion.li
                                key={i}
                                variants={itemVariants}
                                className="flex items-start gap-3 text-slate-300 text-sm sm:text-[15px] leading-relaxed"
                            >
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                <span>{point}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* ── Social links ───────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                    className="flex items-center justify-center gap-4 mb-8 flex-wrap"
                >
                    {[
                        { icon: <FiGithub />, href: 'https://github.com/aviral022', label: 'GitHub' },
                        { icon: <FiLinkedin />, href: 'https://www.linkedin.com/in/aviral-dubey-ml-engineer', label: 'LinkedIn' },
                        { icon: <FiMail />, href: 'mailto:er.aviraldubey@gmail.com', label: 'Email' },
                    ].map((s) => (
                        <a
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-3.5 rounded-xl glass-card text-xl text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
                            aria-label={s.label}
                        >
                            {s.icon}
                        </a>
                    ))}

                    {/* Resume Download */}
                    <a
                        href="/resume.pdf"
                        download
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-white/20 border border-white/80 hover:shadow-white/40"
                    >
                        <FiDownload className="text-lg" />
                        Download Resume
                    </a>
                </motion.div>

                {/* ── Scroll indicator ───────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-xs text-slate-500 uppercase tracking-widest">Scroll to explore</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                    >
                        <FiChevronDown className="text-cyan-400/50 text-xl" />
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
}
