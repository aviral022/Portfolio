import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceTimeline from './components/ExperienceTimeline';
import Projects from './components/Projects';
import TechStack from './components/TechStack';
import GitHubHeatmap from './components/GitHubHeatmap';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import VisitCounter from './components/VisitCounter';
import SnakeGame from './components/SnakeGame';
import NowPlaying from './components/NowPlaying';
import CodeBattle from './components/CodeBattle';

import GalaxyBackground from './components/GalaxyBackground';

function Portfolio() {
    return (
        <>
            {/* Navigation */}
            <Navbar />

            {/* Page sections */}
            <main>
                <Hero />
                <NowPlaying />
                <ExperienceTimeline />
                <Projects />
                <CodeBattle />
                <TechStack />
                <GitHubHeatmap />
                <Contact />
            </main>

            <Footer />

            {/* Floating widgets */}
            <Chatbot />
            <VisitCounter />
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            {/* Galaxy background — Canvas stars + Aurora blobs */}
            <GalaxyBackground />
            <div className="aurora-bg" />
            <div className="aurora-blob-3" />

            <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route path="/snake" element={<SnakeGame />} />
            </Routes>
        </BrowserRouter>
    );
}
