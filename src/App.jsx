import { useEffect, useRef, Suspense, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import HeroSection from './components/sections/HeroSection';
import BeginningSection from './components/sections/BeginningSection';
import HerSection from './components/sections/HerSection';
import TimezoneSection from './components/sections/TimezoneSection';
import VideoCallSection from './components/sections/VideoCallSection';
import MilestonesSection from './components/sections/MilestonesSection';
import StatsSection from './components/sections/StatsSection';
import TogetherMomentsSection from './components/sections/TogetherMomentsSection';
import ProposalSection from './components/sections/ProposalSection';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'framer-motion';
import { Analytics } from "@vercel/analytics/react"

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef();

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  const [playing, setPlaying] = useState(false);

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white overflow-hidden">
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-white">Loading our story...</div>}>
        <HeroSection />
        <BeginningSection />
        <HerSection setPlaying={setPlaying} />
        <TimezoneSection />
        <VideoCallSection />
        <MilestonesSection />
        <StatsSection />
        <TogetherMomentsSection />
        <ProposalSection />
      </Suspense>
      <MusicPlayer playing={playing} setPlaying={setPlaying} />
      <Analytics />

    </div>
  );
}

export default App;
