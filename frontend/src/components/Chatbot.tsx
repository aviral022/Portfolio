import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { api } from '../api';

/* ── Types ─────────────────────────────────────────────────────────────── */
interface Message {
    id: number;
    role: 'user' | 'bot';
    text: string;
    section?: string;
}

/* ── Quick suggestions shown to the user ───────────────────────────────── */
const QUICK_CHIPS = [
    '💼 Projects',
    '🛠️ Skills',
    '📊 Experience',
    '🎓 Education',
    '📬 Contact',
];

/* ── Component ─────────────────────────────────────────────────────────── */
export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 0,
            role: 'bot',
            text: "Hey there! 👋 I'm Aviral's portfolio assistant.\nAsk me about his projects, skills, or experience — or tap a topic below!",
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [showChips, setShowChips] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    /* Auto-scroll when new messages arrive */
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    /* Send a message to the chatbot API */
    const send = useCallback(async (text?: string) => {
        const q = (text ?? input).trim();
        if (!q || loading) return;

        const userMsg: Message = { id: Date.now(), role: 'user', text: q };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setShowChips(false);

        try {
            const res = await api.chatbot(q);
            const botMsg: Message = {
                id: Date.now() + 1,
                role: 'bot',
                text: res.answer,
                section: res.section,
            };
            setMessages(prev => [...prev, botMsg]);
        } catch {
            setMessages(prev => [
                ...prev,
                { id: Date.now() + 1, role: 'bot', text: 'Oops, something went wrong. Please try again!' },
            ]);
        } finally {
            setLoading(false);
        }
    }, [input, loading]);

    /* Handle quick-chip clicks */
    const handleChip = (chip: string) => {
        const label = chip.replace(/^[^\s]+\s/, ''); // strip emoji prefix
        send(label);
    };

    return (
        <>
            {/* ── Floating toggle button ──────────────────────────────── */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
                onClick={() => setOpen(prev => !prev)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 cursor-pointer"
                aria-label="Toggle chat"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={open ? 'close' : 'open'}
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center"
                    >
                        {open ? <FiX /> : <FiMessageCircle />}
                    </motion.span>
                </AnimatePresence>
            </motion.button>

            {/* ── Chat window ─────────────────────────────────────────── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                        className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40"
                        style={{
                            background: 'rgba(10, 10, 30, 0.85)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                                    A
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Portfolio Assistant</h3>
                                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                                        Online • Ask about Aviral
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 chatbot-scroll">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i === 0 ? 0 : 0.05 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-4 py-3 text-[13px] leading-relaxed whitespace-pre-line ${msg.role === 'user'
                                                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-2xl rounded-br-sm shadow-md shadow-cyan-500/10'
                                                : 'bg-white/[0.06] border border-white/[0.08] text-slate-300 rounded-2xl rounded-bl-sm'
                                            }`}
                                    >
                                        {msg.section && (
                                            <span className="block text-[10px] uppercase tracking-widest text-cyan-400 mb-1.5 font-semibold">
                                                {msg.section}
                                            </span>
                                        )}
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Quick suggestion chips */}
                            {showChips && !loading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-wrap gap-2 pt-1"
                                >
                                    {QUICK_CHIPS.map(chip => (
                                        <button
                                            key={chip}
                                            onClick={() => handleChip(chip)}
                                            className="px-3 py-1.5 text-xs font-medium rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-500/40 transition-all cursor-pointer"
                                        >
                                            {chip}
                                        </button>
                                    ))}
                                </motion.div>
                            )}

                            {/* Typing indicator */}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/[0.06] border border-white/[0.08] px-4 py-3 rounded-2xl rounded-bl-sm">
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input bar */}
                        <div className="p-3 border-t border-white/10 bg-white/[0.02]">
                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                                    placeholder="Ask about skills, projects..."
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                />
                                <button
                                    onClick={() => send()}
                                    disabled={loading || !input.trim()}
                                    className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-cyan-500/10"
                                    aria-label="Send"
                                >
                                    <FiSend />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
