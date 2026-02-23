import { motion } from 'framer-motion';

/* ── Skill badges ──────────────────────────────────────────────────────── */
const SKILLS = ['Python', 'Machine Learning', 'Power BI', 'SQL', 'Gen AI'];

export default function NowPlaying() {
    return (
        <section id="now-playing" className="section-container">
            <h2 className="section-heading">
                <span className="gradient-text">🎧 Now Playing: My Career</span>
            </h2>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="np-card"
            >
                {/* ── Top row: Avatar + Info ─────────────────────────── */}
                <div className="np-top">
                    {/* Circular avatar with glowing border */}
                    <div className="np-avatar-wrap">
                        <div className="np-avatar-glow" />
                        <div className="np-avatar">
                            <span className="np-avatar-initials">AD</span>
                        </div>
                    </div>

                    {/* Right info */}
                    <div className="np-info">
                        <span className="np-label">Currently Playing</span>
                        <h3 className="np-name">Aviral Dubey</h3>
                        <p className="np-subtitle">
                            Data Analyst &nbsp;·&nbsp; Machine Learning Engineer &nbsp;·&nbsp; Salesforce Developer
                        </p>
                    </div>
                </div>

                {/* ── Progress bar ───────────────────────────────────── */}
                <div className="np-progress-wrap">
                    <div className="np-progress-track">
                        <motion.div
                            className="np-progress-fill"
                            initial={{ width: '0%' }}
                            whileInView={{ width: '75%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
                        />
                    </div>
                    <div className="np-progress-labels">
                        <span>2022</span>
                        <span>Present</span>
                    </div>
                </div>

                {/* ── Summary ────────────────────────────────────────── */}
                <p className="np-summary">
                    Transforming raw data into actionable insights and building intelligent
                    systems that solve real-world problems. Passionate about leveraging AI,
                    machine learning, and modern analytics to drive impactful decisions.
                </p>

                {/* ── Skill badges ───────────────────────────────────── */}
                <div className="np-badges">
                    {SKILLS.map((skill, i) => (
                        <motion.span
                            key={skill}
                            className="np-badge"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: 0.8 + i * 0.1 }}
                        >
                            {skill}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
