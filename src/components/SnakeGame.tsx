import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const GAME_SPEED = 200;

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
};

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const directionRef = useRef(direction);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isGameOver) return;
    
    // Prevent default scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ') {
      setIsPaused(p => !p);
      return;
    }

    if (isPaused) return;

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [isGameOver, isPaused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [isPaused, isGameOver, food, highScore]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
    gameAreaRef.current?.focus();
  };

  const startGame = () => {
    setIsPaused(false);
    gameAreaRef.current?.focus();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto font-pixel">
      {/* Score Header */}
      <div className="flex justify-between items-center w-full mb-4 px-4 py-2 bg-black border-2 border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
        <div className="flex flex-col">
          <span className="text-cyan-500 text-xl font-bold tracking-widest uppercase">SCORE</span>
          <span className="text-4xl text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-fuchsia-500 text-xl font-bold tracking-widest uppercase flex items-center gap-2">
            <Trophy size={16} /> HIGH SCORE
          </span>
          <span className="text-4xl text-fuchsia-400 drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        ref={gameAreaRef}
        className="relative bg-black border-4 border-fuchsia-500 shadow-[0_0_30px_rgba(255,0,255,0.3)] overflow-hidden focus:outline-none"
        style={{ 
          width: 'min(90vw, 400px)', 
          height: 'min(90vw, 400px)' 
        }}
        tabIndex={0}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #0ff 1px, transparent 1px), linear-gradient(to bottom, #0ff 1px, transparent 1px)',
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Food */}
        <div
          className="absolute bg-fuchsia-500 shadow-[0_0_10px_#f0f,0_0_20px_#f0f] animate-pulse"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            transform: 'scale(0.8)'
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          const tailProgress = index / Math.max(1, snake.length - 1);
          return (
            <div
              key={index}
              className={`absolute ${isHead ? 'bg-cyan-300 z-20 shadow-[0_0_20px_#0ff]' : 'bg-cyan-500'}`}
              style={{
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                transform: isHead ? 'scale(0.95)' : `scale(${0.85 - tailProgress * 0.4})`,
                opacity: Math.max(0.2, 1 - tailProgress * 0.8),
                boxShadow: isHead ? undefined : `0 0 ${10 + tailProgress * 20}px rgba(0,255,255, ${Math.max(0.3, 1 - tailProgress * 0.5)})`,
                zIndex: isHead ? 20 : 10,
                transition: 'left 0.2s linear, top 0.2s linear'
              }}
            />
          );
        })}

        {/* Overlays */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30 border-4 border-red-600 screen-tear">
            <h2 className="text-6xl text-red-500 tracking-widest mb-2 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
            <p className="text-cyan-400 mb-8 text-2xl">FINAL SCORE: {score}</p>
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-black border-2 border-cyan-500 text-cyan-400 text-2xl hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all uppercase"
            >
              <RotateCcw size={24} /> REBOOT_SYSTEM
            </button>
          </div>
        )}

        {!isGameOver && isPaused && score === 0 && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30">
            <button 
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-4 bg-black border-4 border-fuchsia-500 text-fuchsia-400 text-4xl hover:bg-fuchsia-900 hover:shadow-[0_0_30px_rgba(255,0,255,0.6)] transition-all uppercase glitch-text"
              data-text="INITIALIZE"
            >
              <Play size={32} /> INITIALIZE
            </button>
            <p className="text-cyan-500 mt-6 text-xl animate-pulse">AWAITING INPUT...</p>
          </div>
        )}
        
        {!isGameOver && isPaused && score > 0 && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30 screen-tear">
            <h2 className="text-5xl text-cyan-400 tracking-widest mb-8 glitch-text" data-text="SYSTEM_PAUSED">SYSTEM_PAUSED</h2>
            <button 
              onClick={() => setIsPaused(false)}
              className="flex items-center gap-2 px-8 py-3 bg-black border-2 border-cyan-500 text-cyan-400 text-2xl hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all uppercase"
            >
              <Play size={24} /> RESUME_EXECUTION
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile Controls Hint */}
      <div className="mt-4 text-center text-fuchsia-500 text-lg uppercase tracking-widest animate-pulse">
        [ SPACE TO HALT ]
      </div>
    </div>
  );
}
