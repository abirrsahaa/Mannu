import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { narrative } from '../../data/narrative';

const TimezoneSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

    return (
        <section ref={containerRef} className="py-24 bg-slate-900 overflow-hidden relative border-t border-white/5">
            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 1 }}
                >
                    <span className="text-blue-400 uppercase tracking-widest text-sm font-semibold mb-4 block">
                        The Reality
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display text-white mb-12">
                        1,800 Kilometers
                    </h2>
                </motion.div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="text-center cursor-default"
                    >
                        <div className="text-6xl mb-4">✈️</div>
                        <h3 className="text-2xl font-bold text-white mb-2">3 Hours</h3>
                        <p className="text-slate-400">By Flight</p>
                    </motion.div>

                    <motion.div
                        style={{ rotate }}
                        className="w-24 h-24 border-t-2 border-r-2 border-pink-500 rounded-full hidden md:block" // Animated separator
                    />

                    <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className="text-center cursor-default"
                    >
                        <div className="text-6xl mb-4">🚗</div>
                        <h3 className="text-2xl font-bold text-white mb-2">35+ Hours</h3>
                        <p className="text-slate-400">By Road</p>
                    </motion.div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-16 text-xl text-slate-300 max-w-2xl mx-auto italic font-display"
                >
                    "Distance is just a test to see how far love can travel."
                </motion.p>

                <div className="mt-12 bg-white/5 p-8 rounded-2xl max-w-3xl mx-auto border border-white/10 backdrop-blur-sm">
                    <h3 className="text-2xl font-display text-pink-400 mb-4">{narrative.struggle.title}</h3>
                    <p className="text-lg text-slate-300 italic">
                        "{narrative.struggle.text}"
                    </p>
                </div>
            </div>
        </section>
    );
};
export default TimezoneSection;
