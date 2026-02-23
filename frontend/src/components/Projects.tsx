import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { api } from '../api';

interface Project {
    id: number;
    title: string;
    description: string;
    tech_stack: string[];
    image_url: string;
    github_url: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        api.getProjects().then(setProjects).catch(console.error);
    }, []);

    return (
        <section id="projects" className="section-container">
            <h2 className="section-heading">
                <span className="gradient-text">Projects</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, i) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="glass-card overflow-hidden group"
                    >
                        {/* Image placeholder with gradient */}
                        <div className="h-48 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,26,0.8)] to-transparent" />
                            <span className="text-4xl z-10">
                                {project.title.includes('Fraud') ? '🚨' : project.title.includes('Telecom') ? '📊' : '💊'}
                            </span>
                        </div>

                        <div className="p-6">
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                {project.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                                {project.description}
                            </p>

                            {/* Tech badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tech_stack.map((tech) => (
                                    <span key={tech} className="skill-badge text-xs py-1 px-2.5">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Links */}
                            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                                >
                                    <FiGithub /> Code
                                </a>
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-purple-400 transition-colors"
                                >
                                    <FiExternalLink /> Demo
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
