import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { narrative } from '../../data/narrative';

const StatsSection = () => {
    const [days, setDays] = useState(0);
    const startDate = new Date('2023-10-18');

    useEffect(() => {
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDays(diffDays);
    }, []);

    const stats = [
        { label: "Days Since We Started", value: days },
        { label: "Kilometers Apart", value: 1800 },
        { label: "Hours of Travel to Meet", value: "35+" },
        { label: "Love Level", value: "∞" }
    ];

    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            whileHover={{ scale: 1.05, borderColor: "rgba(236, 72, 153, 0.5)" }}
                            className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-sm cursor-default"
                        >
                            <h3 className="text-4xl md:text-6xl font-bold text-white mb-2 font-display bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                {stat.value}
                            </h3>
                            <p className="text-slate-400 text-sm md:text-base uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
