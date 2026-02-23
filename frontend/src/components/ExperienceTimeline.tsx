import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase } from 'react-icons/fi';
import { api } from '../api';

interface ExperienceItem {
    id: number;
    role: string;
    company: string;
    period: string;
    description: string[];
}

export default function ExperienceTimeline() {
    const [items, setItems] = useState<ExperienceItem[]>([]);

    useEffect(() => {
        api.getExperience().then(setItems).catch(console.error);
    }, []);

    return (
        <section id="experience" className="section-container">
            <h2 className="section-heading">
                <span className="gradient-text">Experience</span>
            </h2>

            <div className="relative max-w-3xl mx-auto">
                {/* Vertical line */}
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 via-purple-500/40 to-transparent" />

                {items.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5, delay: i * 0.15 }}
                        className={`relative flex flex-col md:flex-row items-start mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                            }`}
                    >
                        {/* Dot */}
                        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#0a0a1a] z-10 mt-6" />

                        {/* Card */}
                        <div className={`ml-14 md:ml-0 md:w-[45%] ${i % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                            <div className="glass-card p-6">
                                <div className="flex items-center gap-2 text-cyan-400 text-sm mb-2">
                                    <FiBriefcase />
                                    <span>{item.period}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{item.role}</h3>
                                <p className="text-purple-400 text-sm font-medium mb-3">{item.company}</p>
                                <ul className="space-y-2">
                                    {item.description.map((point, j) => (
                                        <li key={j} className="text-slate-400 text-sm flex items-start gap-2">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500/50 shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
