import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiEye } from 'react-icons/fi';
import { api } from '../api';

export default function VisitCounter() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        api.recordVisit().then((data) => setCount(data.total_visits)).catch(console.error);
    }, []);

    if (count === null) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3 py-2 rounded-full glass-card text-xs text-slate-400"
        >
            <FiEye className="text-cyan-400" />
            <span>{count.toLocaleString()} visits</span>
        </motion.div>
    );
}
