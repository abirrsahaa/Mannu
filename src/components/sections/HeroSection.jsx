import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, QuadraticBezierLine, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { narrative } from '../../data/narrative';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to convert lat/lon to 3D position
const getPosition = (lat, lon, radius = 2) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
};

const CityMarker = ({ position, name, isHovered, setIsHovered }) => {
    return (
        <group position={position}>
            <mesh
                onPointerOver={() => setIsHovered(name)}
                onPointerOut={() => setIsHovered(null)}
            >
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshBasicMaterial color="#e11d48" toneMapped={false} />
                <pointLight color="#e11d48" distance={0.5} intensity={2} />
            </mesh>
            <mesh>
                <ringGeometry args={[0.04, 0.06, 32]} />
                <meshBasicMaterial color="#e11d48" opacity={0.5} transparent side={THREE.DoubleSide} />
            </mesh>
            <Html distanceFactor={10}>
                <div className={`transition-all duration-300 ${isHovered === name ? 'opacity-100 scale-110' : 'opacity-70 scale-100'}`}>
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap border border-pink-500/30 shadow-[0_0_15px_rgba(225,29,72,0.3)] transform -translate-x-1/2 -translate-y-[150%]">
                        {name}
                    </div>
                </div>
            </Html>
        </group>
    );
};

const JourneyLine = ({ start, end, mid, progress }) => {
    const curve = useMemo(() => {
        return new THREE.QuadraticBezierCurve3(start, mid, end);
    }, [start, end, mid]);

    const points = useMemo(() => curve.getPoints(50), [curve]);

    return (
        <group>
            {/* Base Line */}
            <QuadraticBezierLine
                start={start}
                end={end}
                mid={mid}
                color="#fbbf24"
                lineWidth={1.5}
                dashed={true}
                gapSize={0.05}
                dashScale={0.1}
                opacity={0.3}
                transparent
            />
            {/* Progress/Active Line */}
            {/* Animating line is tricky, easier to animate an object along the path */}
        </group>
    );
}

const MovingPlane = ({ route, progress }) => {
    // route is a curve
    const position = route.getPoint(progress);
    const tangent = route.getTangent(progress);

    return (
        <group position={position} lookAt={position.clone().add(tangent)}>
            <mesh rotation={[0, -Math.PI / 2, 0]}>
                <coneGeometry args={[0.03, 0.1, 8]} />
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
            </mesh>
        </group>
    );
};

const Globe = ({ setJourneyState, journeyState }) => {
    const globeRef = useRef();
    const [hoveredCity, setHoveredCity] = useState(null);

    // Load Texture (This was stable with NO other layers)
    // Re-enable for realism and use Suspense safe loading
    const map = useLoader(THREE.TextureLoader, '/assets/earth/map.jpg');

    // Coordinates
    const bangalorePos = useMemo(() => getPosition(12.9716, 77.5946, 2), []);
    const phagwaraPos = useMemo(() => getPosition(31.2240, 75.7708, 2), []);

    const midPoint = useMemo(() => {
        const mid = new THREE.Vector3().addVectors(bangalorePos, phagwaraPos).multiplyScalar(0.5);
        return mid.normalize().multiplyScalar(2.5); // Arc height
    }, [bangalorePos, phagwaraPos]);

    const journeyCurve = useMemo(() => new THREE.QuadraticBezierCurve3(bangalorePos, midPoint, phagwaraPos), [bangalorePos, midPoint, phagwaraPos]);

    useFrame((state) => {
        // Idle Rotation
        if (!journeyState.active && globeRef.current) {
            globeRef.current.rotation.y += 0.0005;
        }

        // Camera Animation
        if (journeyState.active) {
            // Phases: 
            // 0.0 - 0.2: Zoom In to Start (Bangalore)
            // 0.2 - 0.8: Fly Phase (Follow Curve)
            // 0.8 - 1.0: End/Zoom Out (Phagwara)

            const p = journeyState.progress;

            if (p < 0.2) {
                // Zoom in
                const t = p / 0.2;
                const startPos = new THREE.Vector3(0, 0, 8); // Start further out
                // Target camera position: Above Bangalore
                const targetPos = bangalorePos.clone().multiplyScalar(1.5).add(new THREE.Vector3(0, 0.5, 0));

                // Smoother transition
                const smoothT = t * t * (3 - 2 * t);
                state.camera.position.lerpVectors(startPos, targetPos, smoothT);

                // Look At: Lerp from Earth Center (0,0,0) to Bangalore (bangalorePos)
                const currentLookAt = new THREE.Vector3().lerpVectors(new THREE.Vector3(0, 0, 0), bangalorePos, smoothT);
                state.camera.lookAt(currentLookAt);

            } else if (p < 0.8) {
                // Fly
                const t = (p - 0.2) / 0.6;
                const currentPoint = journeyCurve.getPoint(t);
                const nextPoint = journeyCurve.getPoint(Math.min(t + 0.05, 1)); // Look ahead

                // Camera position: Above the curve
                const cameraPos = currentPoint.clone().multiplyScalar(1.5); // Height above curve
                state.camera.position.lerp(cameraPos, 0.1);

                // Look At: Slightly ahead on the curve
                state.camera.lookAt(nextPoint);

            } else {
                // Zoom out
                const t = (p - 0.8) / 0.2;
                const startPos = phagwaraPos.clone().multiplyScalar(1.5).add(new THREE.Vector3(0, 0.5, 0));
                const endPos = new THREE.Vector3(0, 0, 8);

                const smoothT = t * t * (3 - 2 * t);
                state.camera.position.lerpVectors(startPos, endPos, smoothT);

                // Look At: Lerp from Phagwara to Earth Center
                const currentLookAt = new THREE.Vector3().lerpVectors(phagwaraPos, new THREE.Vector3(0, 0, 0), smoothT);
                state.camera.lookAt(currentLookAt);
            }
        }
    });

    return (
        <group>
            <group ref={globeRef} rotation={[0.2, 0, 0]}>
                {/* Realistic Earth - Texture back on */}
                <mesh>
                    <sphereGeometry args={[2, 64, 64]} />
                    <meshPhongMaterial
                        map={map}
                        specular={new THREE.Color('grey')}
                        shininess={10}
                    />
                </mesh>

                {/* Simple Atmosphere Glow */}
                <mesh scale={[1.02, 1.02, 1.02]}>
                    <sphereGeometry args={[2, 64, 64]} />
                    <meshBasicMaterial color="#4f46e5" transparent opacity={0.1} side={THREE.BackSide} />
                </mesh>

                <CityMarker position={bangalorePos} name={narrative.hero.city1} isHovered={hoveredCity} setIsHovered={setHoveredCity} />
                <CityMarker position={phagwaraPos} name={narrative.hero.city2} isHovered={hoveredCity} setIsHovered={setHoveredCity} />

                <QuadraticBezierLine
                    start={bangalorePos}
                    end={phagwaraPos}
                    mid={midPoint}
                    color="#fbbf24"
                    lineWidth={2}
                    dashScale={0.2}
                />

                {journeyState.active && (
                    <MovingPlane route={journeyCurve} progress={(Math.max(0, journeyState.progress - 0.2)) / 0.6} />
                )}
            </group>

            {/* Stars Background */}
            <Stars radius={300} depth={60} count={2000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
};

// Fallback component
const DigitalGlobeFallback = ({ setJourneyState, journeyState }) => {
    // Re-use logic for digital globe for fallback
    const globeRef = useRef();
    const [hoveredCity, setHoveredCity] = useState(null);
    const bangalorePos = useMemo(() => getPosition(12.9716, 77.5946, 2), []);
    const phagwaraPos = useMemo(() => getPosition(31.2240, 75.7708, 2), []);
    const midPoint = useMemo(() => {
        const mid = new THREE.Vector3().addVectors(bangalorePos, phagwaraPos).multiplyScalar(0.5);
        return mid.normalize().multiplyScalar(2.5);
    }, [bangalorePos, phagwaraPos]);
    const journeyCurve = useMemo(() => new THREE.QuadraticBezierCurve3(bangalorePos, midPoint, phagwaraPos), [bangalorePos, midPoint, phagwaraPos]);

    useFrame((state) => {
        if (!journeyState.active && globeRef.current) globeRef.current.rotation.y += 0.0005;
    });

    return (
        <group>
            <group ref={globeRef} rotation={[0.2, 0, 0]}>
                <mesh>
                    <sphereGeometry args={[2, 64, 64]} />
                    <meshStandardMaterial color="#1e3a8a" roughness={0.7} metalness={0.1} />
                </mesh>
                <mesh scale={[1.002, 1.002, 1.002]}>
                    <sphereGeometry args={[2, 32, 32]} />
                    <meshBasicMaterial color="#60a5fa" wireframe={true} transparent opacity={0.15} />
                </mesh>
                <CityMarker position={bangalorePos} name={narrative.hero.city1} isHovered={hoveredCity} setIsHovered={setHoveredCity} />
                <CityMarker position={phagwaraPos} name={narrative.hero.city2} isHovered={hoveredCity} setIsHovered={setHoveredCity} />
                <QuadraticBezierLine start={bangalorePos} end={phagwaraPos} mid={midPoint} color="#fbbf24" lineWidth={2} dashScale={0.2} />
            </group>
            <Stars radius={300} depth={60} count={2000} factor={4} saturation={0} fade speed={1} />
        </group>
    )
}

const Experience = ({ journeyState }) => {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <color attach="background" args={['#0f172a']} />
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />

            <React.Suspense fallback={<DigitalGlobeFallback journeyState={journeyState} setJourneyState={() => { }} />}>
                <Globe journeyState={journeyState} setJourneyState={() => { }} />
            </React.Suspense>

            <OrbitControls
                enableZoom={false}
                autoRotate={!journeyState.active}
                autoRotateSpeed={0.5}
                enablePan={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI - Math.PI / 3}
            />
        </Canvas>
    );
};

const HeroSection = () => {
    const [journeyState, setJourneyState] = useState({ active: false, progress: 0 });
    const [showButton, setShowButton] = useState(true);

    const startJourney = () => {
        setJourneyState({ active: true, progress: 0 });
        setShowButton(false);

        // Animate progress
        let start = null;
        const duration = 5000; // 5 seconds journey

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const p = Math.min(elapsed / duration, 1);

            setJourneyState(prev => ({ ...prev, progress: p }));

            if (p < 1) {
                requestAnimationFrame(step);
            } else {
                // End journey
                setTimeout(() => {
                    setJourneyState({ active: false, progress: 0 });
                    setShowButton(true);
                }, 1000);
            }
        };

        requestAnimationFrame(step);
    };

    return (
        <section className="h-screen w-full relative flex items-center justify-center bg-gray-900 overflow-hidden">
            <div className="absolute inset-0 z-0 cursor-move">
                <Experience journeyState={journeyState} />
            </div>

            <div className={`relative z-10 text-center px-4 transition-opacity duration-500 ${journeyState.active ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <motion.h1
                    className="text-5xl md:text-8xl font-display font-bold mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent"
                >
                    {narrative.hero.distance}
                </motion.h1>

                <div className="space-y-4">
                    <p className="text-xl md:text-2xl font-light tracking-wide text-blue-200/90 font-display italic">
                        {narrative.hero.city1} &mdash; {narrative.hero.city2}
                    </p>

                    {showButton && (
                        <motion.button
                            onClick={startJourney}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-8 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-display text-lg hover:bg-white/20 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] group"
                        >
                            <span className="mr-2">✈️</span> See Our Journey
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Journey Overlay */}
            <AnimatePresence>
                {journeyState.active && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white font-display"
                    >
                        Travelling... {Math.round(journeyState.progress * 1800)} km covered
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default HeroSection;
