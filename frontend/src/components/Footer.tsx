import { FiHeart } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-sm text-slate-500 flex items-center gap-1">
                    Built with <FiHeart className="text-pink-500 text-xs" /> by{' '}
                    <span className="text-slate-300 font-medium">Aviral Dubey</span>
                </p>
                <p className="text-xs text-slate-600">© 2025 All rights reserved.</p>
            </div>
        </footer>
    );
}
