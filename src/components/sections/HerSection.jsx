import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { narrative } from '../../data/narrative';

const HerSection = ({ setPlaying }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <section ref={containerRef} className="min-h-screen py-24 bg-slate-900 relative">
            <div className="container mx-auto px-4 md:px-8">
                <motion.div
                    style={{ y }}
                    className="text-center mb-16 relative z-10"
                    onViewportEnter={() => setPlaying && setPlaying(true)}
                >
                    <h2 className="text-4xl md:text-6xl font-display text-white mb-6">
                        {narrative.her.title}
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {narrative.her.qualities.map((quality, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(236, 72, 153, 0.2)" }}
                                className="px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-sm md:text-base uppercase tracking-wider backdrop-blur-md cursor-default"
                            >
                                {quality}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                {/* Masonry-ish Grid for Photos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {narrative.her.photos.map((photo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 1 : -1, zIndex: 10 }}
                            className={`relative overflow-hidden rounded-2xl group ${index === 0 || index === 4 ? 'col-span-1 md:col-span-2 lg:col-span-2 aspect-video' : 'aspect-[3/4]'} cursor-pointer shadow-lg`}
                        >
                            <img
                                src={photo}
                                alt="Her"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                <span className="text-white font-display text-lg tracking-wider">Beautiful 💖</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Videos Row (Autoplay muted loop) */}
                {narrative.her.videos.length > 0 && (
                    <div className="space-y-8">
                        <h3 className="text-2xl md:text-3xl font-display text-center text-white/80">Moments in Motion</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {narrative.her.videos.map((video, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: false, amount: 0.3 }}
                                    transition={{ duration: 0.8 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[9/16] cursor-pointer"
                                >
                                    <video
                                        src={video}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HerSection;
