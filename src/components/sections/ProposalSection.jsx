import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { narrative } from '../../data/narrative';
import confetti from 'canvas-confetti';

const ProposalSection = () => {
    const [step, setStep] = useState(-1); // -1: Envelope, 0: Valentine, 1: Forever, 2: Final
    const [noCount, setNoCount] = useState(0);
    const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });

    const handleYes = () => {
        if (step === 0) {
            setStep(1);
            setNoCount(0);
            confetti({
                particleCount: 50,
                spread: 50,
                origin: { y: 0.7 },
                colors: ['#e11d48']
            });
        } else {
            setStep(2);
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#e11d48', '#fbbf24', '#ffffff']
            });
            // Continuous celebration logic...
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
            const randomInRange = (min, max) => Math.random() * (max - min) + min;
            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        }
    };

    const moveNoButton = () => {
        setNoCount(prev => prev + 1);
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        setNoBtnPos({ x, y });
    };

    const openEnvelope = () => {
        setStep(0);
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden py-20 px-6">
            {/* Background Hearts */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: '100vh', x: Math.random() * 100 + 'vw' }}
                        animate={{ opacity: [0, 1, 0], y: '-10vh', rotate: Math.random() * 360 }}
                        transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, delay: Math.random() * 10 }}
                        className="absolute text-pink-500/20 text-6xl"
                    >
                        ♥
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10 max-w-4xl w-full text-center">
                <AnimatePresence mode="wait">
                    {/* ENVELOPE STEP */}
                    {step === -1 && (
                        <motion.div
                            key="envelope"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0, rotateX: 90 }}
                            className="cursor-pointer group perspective-1000"
                            onClick={openEnvelope}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="relative w-64 h-48 bg-pink-100 mx-auto rounded-lg shadow-2xl flex items-center justify-center border-2 border-pink-200">
                                <span className="text-4xl">💌</span>
                                <div className="absolute -top-12 left-0 w-0 h-0 border-l-[128px] border-l-transparent border-r-[128px] border-r-transparent border-b-[96px] border-b-pink-200 group-hover:rotate-x-180 origin-bottom transition-transform duration-700"></div>
                                <p className="absolute -bottom-10 text-white font-display text-xl animate-bounce">Click to Open</p>
                            </div>
                        </motion.div>
                    )}

                    {/* QUESTION 1 */}
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
                            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            className="space-y-12"
                        >
                            <h2 className="text-4xl md:text-7xl font-display text-white drop-shadow-lg">
                                {narrative.proposal.question1}
                            </h2>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12 relative h-32">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleYes}
                                    className="px-12 py-4 bg-pink-600 hover:bg-pink-500 text-white text-2xl font-bold rounded-full shadow-lg shadow-pink-600/30 transition-colors z-20"
                                >
                                    Yes, I will! 💖
                                </motion.button>

                                <motion.button
                                    animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                                    onHoverStart={moveNoButton}
                                    onClick={moveNoButton}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="px-8 py-3 bg-slate-800 text-slate-300 text-xl rounded-full border border-white/10 absolute md:static"
                                >
                                    {noCount === 0 ? "No" : ["Are you sure?", "Really?", "Think again!", "Last chance!", "Pretty please? 🥺"][Math.min(noCount, 4)]}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* QUESTION 2 */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            className="space-y-12"
                        >
                            <h2 className="text-3xl md:text-6xl font-display text-white drop-shadow-lg leading-tight">
                                {narrative.proposal.question2}
                            </h2>

                            <div className="flex justify-center mt-12">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleYes}
                                    className="px-16 py-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-3xl font-bold rounded-full shadow-2xl shadow-purple-600/40 ring-4 ring-purple-400/20"
                                >
                                    Yes, Forever! 💍
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* FINAL LETTER */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="max-w-2xl mx-auto bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl"
                        >
                            <h3 className="text-3xl font-display text-pink-400 mb-8">Until We Close The Distance...</h3>
                            <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-light italic whitespace-pre-line">
                                "{narrative.proposal.finalLetter || "I love you"}"
                            </p>
                            <div className="mt-12 text-sm text-slate-500 uppercase tracking-widest">
                                Forever Yours, {narrative.her.qualities[3] || "Me"}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default ProposalSection;
