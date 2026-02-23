import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const LINKS = [
    {
        icon: <FiLinkedin />,
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/aviral-dubey-ml-engineer',
        color: 'from-blue-500/20 to-blue-600/10 border-blue-500/25 text-blue-400 hover:shadow-blue-500/15',
    },
    {
        icon: <FiGithub />,
        label: 'GitHub',
        href: 'https://github.com/aviral022',
        color: 'from-slate-500/20 to-slate-600/10 border-slate-500/25 text-slate-300 hover:shadow-slate-500/15',
    },
    {
        icon: <FiMail />,
        label: 'Gmail',
        href: 'mailto:er.aviraldubey@gmail.com',
        color: 'from-red-500/20 to-red-600/10 border-red-500/25 text-red-400 hover:shadow-red-500/15',
    },
];

export default function Contact() {
    return (
        <section id="contact" className="section-container">
            <h2 className="section-heading">
                <span className="gradient-text">Get in Touch</span>
            </h2>
            <p className="text-center text-slate-400 text-sm mb-10 -mt-6">
                Let's connect — I'd love to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                {LINKS.map((link, i) => (
                    <motion.a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: i * 0.12 }}
                        className={`glass-card flex flex-col items-center gap-3 px-8 py-7 w-48 text-center bg-gradient-to-b border ${link.color} hover:scale-105 transition-all duration-300 hover:shadow-lg cursor-pointer`}
                    >
                        <span className="text-3xl">{link.icon}</span>
                        <span className="text-base font-bold text-white">{link.label}</span>
                    </motion.a>
                ))}
            </div>
        </section>
    );
}

