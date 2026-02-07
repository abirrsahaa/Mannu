import { useState } from 'react';
import Sound from 'react-sound';

const MusicPlayer = ({ playing, setPlaying }) => {
    // If props aren't passed (fallback), use internal state
    const [internalPlaying, setInternalPlaying] = useState(false);
    const isPlaying = playing !== undefined ? playing : internalPlaying;

    const togglePlaying = () => {
        if (setPlaying) {
            setPlaying(!playing);
        } else {
            setInternalPlaying(!internalPlaying);
        }
    };

    return (
        <div className="fixed bottom-4 left-4 z-50">
            <Sound
                url="/music/rabba.mp3"
                playStatus={isPlaying ? Sound.status.PLAYING : Sound.status.PAUSED}
                volume={100}
                loop={true}
                onLoading={() => { }}
                onPlaying={() => { }}
                onFinishedPlaying={() => { }}
            />

            {/* Music Control Button */}
            <button
                onClick={togglePlaying}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full text-white hover:bg-white/20 transition-colors shadow-lg animate-pulse-slow"
                aria-label={isPlaying ? "Pause Music" : "Play Music"}
            >
                {playing ? (
                    <div className="flex space-x-1 items-end h-4">
                        <div className="w-1 bg-pink-500 h-full animate-[bounce_1s_infinite]"></div>
                        <div className="w-1 bg-pink-500 h-2/3 animate-[bounce_1.2s_infinite]"></div>
                        <div className="w-1 bg-pink-500 h-3/4 animate-[bounce_0.8s_infinite]"></div>
                    </div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-6-2 6M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                )}
            </button>
            {!isPlaying && (
                <div className="absolute left-14 top-2 bg-black/80 text-white text-xs px-3 py-1 rounded whitespace-nowrap">
                    Play "Rabba Heropanti" 🎵
                </div>
            )}
        </div>
    );
};

export default MusicPlayer;
