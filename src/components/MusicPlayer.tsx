import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Dreams', artist: 'AI Synth', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cybernetic Pulse', artist: 'AI Synth', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Digital Horizon', artist: 'AI Synth', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="bg-black border-2 border-fuchsia-500 p-6 shadow-[0_0_15px_rgba(255,0,255,0.3)] w-full max-w-md mx-auto font-pixel">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={nextTrack}
        loop={false}
      />
      
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center w-full border-b-2 border-cyan-500 pb-4">
          <h3 className="text-3xl text-fuchsia-400 tracking-wider glitch-text" data-text={currentTrack.title.toUpperCase()}>
            {currentTrack.title.toUpperCase()}
          </h3>
          <p className="text-cyan-400 text-xl mt-2">[{currentTrack.artist.toUpperCase()}]</p>
        </div>

        <div className="flex items-center justify-center space-x-8 w-full">
          <button 
            onClick={prevTrack}
            className="text-cyan-400 hover:text-white transition-all hover:scale-110"
          >
            <SkipBack size={32} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-20 h-20 flex items-center justify-center bg-black border-4 border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-900 shadow-[0_0_15px_rgba(255,0,255,0.6)] transition-all hover:scale-105"
          >
            {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-2" />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-cyan-400 hover:text-white transition-all hover:scale-110"
          >
            <SkipForward size={32} />
          </button>
        </div>

        <div className="flex items-center space-x-4 w-full px-2">
          <button onClick={toggleMute} className="text-fuchsia-500 hover:text-white transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-full h-2 bg-black border border-cyan-500 appearance-none cursor-pointer accent-fuchsia-500"
          />
        </div>
      </div>
    </div>
  );
}
