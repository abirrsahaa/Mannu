import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { narrative } from '../../data/narrative';

const VideoCallSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="py-20 bg-black overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.h2
                    style={{ opacity }}
                    className="text-3xl md:text-5xl font-display text-white mb-12"
                >
                    {narrative.videoCalls.text}
                </motion.h2>

                <motion.div
                    style={{ scale }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                >
                    {narrative.videoCalls.videos.map((video, index) => (
                        <motion.div
                            key={index}
                            className="relative aspect-[9/16] rounded-2xl overflow-hidden border-4 border-gray-800 shadow-2xl bg-gray-900"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="absolute top-4 left-4 z-10 bg-black/50 px-2 py-1 rounded text-xs text-white">
                                Incoming Call...
                            </div>
                            <video
                                src={video}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                <div className="flex justify-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2 2m-2 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
export default VideoCallSection;
