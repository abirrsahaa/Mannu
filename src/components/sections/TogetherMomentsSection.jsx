import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { narrative } from '../../data/narrative';

const TogetherMomentsSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section ref={containerRef} className="bg-slate-900 pb-24 relative overflow-hidden">
            <div className="container mx-auto px-6 py-24 text-center">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 1 }}
                    className="text-4xl md:text-6xl font-display text-white mb-6"
                >
                    {narrative.together.title}
                </motion.h2>
                <p className="text-xl text-slate-300 font-light max-w-2xl mx-auto mb-20 italic">
                    "{narrative.together.text}"
                </p>

                <div className="space-y-24">
                    {narrative.together.assets.map((src, index) => (
                        <ParallaxImage key={index} src={src} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ParallaxImage = ({ src, index }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={ref}
            style={{ scale, opacity }}
            whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`relative w-full md:w-3/4 mx-auto aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 ${index % 2 === 0 ? 'rotate-1 md:rotate-2 border-pink-500/20' : '-rotate-1 md:-rotate-2 border-blue-500/20'} cursor-pointer`}
        >
            <motion.div style={{ y }} className="w-full h-[120%] -mt-[10%]">
                <img src={src} alt="Together" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" loading="lazy" />
            </motion.div>
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl" />
        </motion.div>
    );
};

export default TogetherMomentsSection;
