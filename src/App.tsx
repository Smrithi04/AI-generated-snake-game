/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-pixel selection:bg-fuchsia-500/30 overflow-hidden relative flex flex-col uppercase">
      <div className="static-noise"></div>
      
      {/* Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-40" />

      {/* Header */}
      <header className="relative z-10 w-full p-4 border-b-4 border-fuchsia-600 bg-black flex justify-between items-center screen-tear">
        <h1 className="text-4xl md:text-6xl tracking-widest glitch-text flex items-center gap-4" data-text="SYSTEM.SNAKE_PROTOCOL">
          <Gamepad2 className="text-fuchsia-500 w-10 h-10 md:w-14 md:h-14" />
          SYSTEM.SNAKE_PROTOCOL
        </h1>
        <div className="text-fuchsia-500 text-xl animate-pulse hidden md:block">
          STATUS: ONLINE
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-start justify-center gap-8 p-4 md:p-8 w-full max-w-7xl mx-auto">
        
        {/* Left/Top: Game Area */}
        <div className="w-full lg:w-2/3 flex justify-center border-2 border-cyan-500 p-2 bg-black shadow-[0_0_20px_rgba(0,255,255,0.2)]">
          <SnakeGame />
        </div>

        {/* Right/Bottom: Music Player & Info */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="border-2 border-fuchsia-500 p-1 bg-black shadow-[0_0_20px_rgba(255,0,255,0.2)]">
            <MusicPlayer />
          </div>
          
          <div className="border-2 border-cyan-500 p-4 bg-black text-cyan-400">
            <h3 className="text-2xl mb-4 border-b-2 border-fuchsia-500 pb-2 glitch-text" data-text="DIRECTIVES">
              DIRECTIVES
            </h3>
            <ul className="text-xl space-y-4">
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-500">[{'>'}]</span>
                <span>INPUT: W,A,S,D / ARROWS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-500">[{'>'}]</span>
                <span>OBJECTIVE: CONSUME MAGENTA DATA PACKETS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-500">[{'>'}]</span>
                <span>WARNING: AVOID BOUNDARY COLLISION</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-500">[{'>'}]</span>
                <span>HALT: SPACEBAR</span>
              </li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}
