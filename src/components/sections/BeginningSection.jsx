import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { narrative } from '../../data/narrative';

const BeginningSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <section ref={containerRef} className="min-h-screen flex items-center justify-center bg-slate-950 py-20 px-6 md:px-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 opacity-40 pointers-events-none" />

            <div className="max-w-4xl mx-auto relative z-10 text-center">
                <motion.div style={{ y }} className="space-y-16">
                    <motion.div
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-10%" }}
                        transition={{ duration: 1 }}
                    >
                        <span className="text-sm font-sans uppercase tracking-[0.3em] text-blue-400 mb-4 block">
                            {narrative.meeting.subtitle}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-display text-white mb-2">
                            {narrative.meeting.title}
                        </h2>
                    </motion.div>

                    <div className="prose prose-xl prose-invert mx-auto">
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-10%" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-xl md:text-3xl leading-relaxed text-slate-300 font-light italic font-display"
                        >
                            &ldquo;{narrative.meeting.text}&rdquo;
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, margin: "-10%" }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="pt-12 border-t border-white/5 mt-12 bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10"
                    >
                        <h3 className="text-2xl font-display text-love-red mb-4">{narrative.spark.title}</h3>
                        <p className="text-lg text-slate-300">
                            {narrative.spark.text}
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
export default BeginningSection;
