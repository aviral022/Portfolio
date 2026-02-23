import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api';
import {
    FiCode, FiCpu, FiDatabase, FiTool, FiLayers, FiBarChart2, FiGrid, FiZap, FiCloud,
} from 'react-icons/fi';

interface SkillCategory {
    id: number;
    category: string;
    items: string[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    Languages: <FiCode />,
    Frameworks: <FiLayers />,
    'AI & ML': <FiCpu />,
    'Data & Analytics': <FiBarChart2 />,
    Databases: <FiDatabase />,
    Tools: <FiTool />,
    'Gen AI': <FiZap />,
    Salesforce: <FiCloud />,
    Concepts: <FiGrid />,
};

const CATEGORY_COLORS: Record<string, string> = {
    Languages: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20 text-cyan-400',
    Frameworks: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400',
    'AI & ML': 'from-pink-500/20 to-pink-600/10 border-pink-500/20 text-pink-400',
    'Data & Analytics': 'from-green-500/20 to-green-600/10 border-green-500/20 text-green-400',
    Databases: 'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400',
    Tools: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
    'Gen AI': 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400',
    Salesforce: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20 text-indigo-400',
    Concepts: 'from-rose-500/20 to-rose-600/10 border-rose-500/20 text-rose-400',
};

export default function TechStack() {
    const [skills, setSkills] = useState<SkillCategory[]>([]);

    useEffect(() => {
        api.getSkills().then(setSkills).catch(console.error);
    }, []);

    return (
        <section id="skills" className="section-container">
            <h2 className="section-heading">
                <span className="gradient-text">Tech Stack</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {skills.map((cat, i) => {
                    const colorClass = CATEGORY_COLORS[cat.category] || CATEGORY_COLORS['Concepts'];
                    return (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="glass-card p-5"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`text-lg ${colorClass.split(' ').pop()}`}>
                                    {CATEGORY_ICONS[cat.category] || <FiGrid />}
                                </span>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                    {cat.category}
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {cat.items.map((item) => (
                                    <span
                                        key={item}
                                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r border ${colorClass}`}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
