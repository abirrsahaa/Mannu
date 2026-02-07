import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { narrative } from '../../data/narrative';

gsap.registerPlugin(ScrollTrigger);

const MilestonesSection = () => {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        const totalWidth = sectionRef.current.scrollWidth;
        const windowWidth = window.innerWidth;
        const scrollWidth = totalWidth - windowWidth;

        const pin = gsap.to(sectionRef.current, {
            x: -scrollWidth,
            ease: "none",
            scrollTrigger: {
                trigger: triggerRef.current,
                start: "top top",
                end: `+=${scrollWidth}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            },
        });

        return () => {
            if (pin.scrollTrigger) pin.scrollTrigger.kill();
            pin.kill();
        };
    }, []);

    return (
        <section className="overflow-hidden bg-slate-900" ref={triggerRef}>
            <div
                ref={sectionRef}
                className="h-screen flex flex-row w-fit"
                style={{ width: `${narrative.milestones.length * 100}vw` }}
            >
                {narrative.milestones.map((milestone, index) => (
                    <div
                        key={index}
                        className="w-screen h-full flex-shrink-0 flex flex-col justify-center items-center px-6 md:px-20 relative border-r border-white/5 bg-gradient-to-b from-slate-900 to-slate-950"
                    >
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 -z-10" />

                        <div className="relative z-10 max-w-4xl text-center p-8 md:p-16 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                            <span className="text-pink-500 font-bold tracking-widest uppercase mb-4 block">
                                Milestone {index + 1}
                            </span>
                            <h3 className="text-5xl md:text-7xl font-display text-white mb-6">
                                {milestone.date}
                            </h3>
                            <h4 className="text-2xl md:text-3xl font-display text-blue-300 mb-6">
                                {milestone.title}
                            </h4>
                            <p className="text-lg md:text-xl text-slate-400 font-light italic">
                                "{milestone.description}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MilestonesSection;
