import React, { useState, useEffect, useRef } from 'react';
import Pacman from './Pacman';
import Ghost from './Ghost';
import Dot from './Dot';

const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 15;
const TILE_SIZE = 32;
const INITIAL_LIVES = 3;
const MAX_LIVES = 5;

export default function GameBoard() {
  const [pacmanPos, setPacmanPos] = useState({ x: 1, y: 1 });
  const [ghostPos, setGhostPos] = useState([
    { x: 5, y: 5 },
    { x: 10, y: 7 },
    { x: 15, y: 3 },
    { x: 8, y: 7 },
    { x: 11, y: 10 }
  ]);
  const [dots, setDots] = useState([]);
  const [heartDots, setHeartDots] = useState([]);
  const [lives, setLives] = useState(INITIAL_LIVES);

  const pacmanRef = useRef(pacmanPos);
  useEffect(() => {
    pacmanRef.current = pacmanPos;
  }, [pacmanPos]);

  useEffect(() => {
    const initialDots = [];
    const heartPositions = [];

    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (!(x === 1 && y === 1)) {
          initialDots.push({ x, y });
        }
      }
    }

    while (heartPositions.length < 3) {
      const randIndex = Math.floor(Math.random() * initialDots.length);
      const heart = initialDots.splice(randIndex, 1)[0];
      heartPositions.push(heart);
    }

    setDots(initialDots);
    setHeartDots(heartPositions);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPacmanPos((pos) => {
        let { x, y } = pos;
        if (e.key === 'ArrowUp') y = Math.max(0, y - 1);
        if (e.key === 'ArrowDown') y = Math.min(BOARD_HEIGHT - 1, y + 1);
        if (e.key === 'ArrowLeft') x = Math.max(0, x - 1);
        if (e.key === 'ArrowRight') x = Math.min(BOARD_WIDTH - 1, x + 1);
        return { x, y };
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setDots((prev) => prev.filter(dot => !(dot.x === pacmanPos.x && dot.y === pacmanPos.y)));
    setHeartDots((prev) => {
      const remaining = prev.filter(dot => !(dot.x === pacmanPos.x && dot.y === pacmanPos.y));
      if (remaining.length < prev.length) {
        setLives((prevLives) => Math.min(MAX_LIVES, prevLives + 1));
      }
      return remaining;
    });
  }, [pacmanPos]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGhostPos((prevGhosts) => {
        const updated = prevGhosts.map((pos) => {
          const directions = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
          ];
          const move = directions[Math.floor(Math.random() * directions.length)];
          const newX = Math.max(0, Math.min(BOARD_WIDTH - 1, pos.x + move.x));
          const newY = Math.max(0, Math.min(BOARD_HEIGHT - 1, pos.y + move.y));
          return { x: newX, y: newY };
        });

        const collision = updated.some(g =>
          g.x === pacmanRef.current.x && g.y === pacmanRef.current.y
        );
        if (collision) {
          setLives((prevLives) => {
            const nextLives = prevLives - 1;
            if (nextLives <= 0) {
              alert('Game Over! Oyun yeniden başlatılıyor.');
              window.location.reload();
            }
            return nextLives;
          });
        }

        return updated;
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      
    <div style={{ display: 'flex', gap: 4, padding: 8 }}>
      {[...Array(lives)].map((_, idx) => (
        <div
          key={idx}
          style={{
            width: 20,
            height: 20,
            backgroundColor: 'red',
            clipPath: 'polygon(50% 0%, 100% 35%, 85% 100%, 50% 75%, 15% 100%, 0% 35%)',
          }}
        ></div>
      ))}
    </div>
    
      <div
        className="board"
        style={{
          width: `${BOARD_WIDTH * TILE_SIZE}px`,
          height: `${BOARD_HEIGHT * TILE_SIZE}px`,
          position: 'relative',
        }}
      >
        {dots.map((dot, idx) => (
          <Dot key={idx} x={dot.x} y={dot.y} tileSize={TILE_SIZE} />
        ))}
        {heartDots.map((heart, idx) => (
          <div
            key={`heart-${idx}`}
            style={{
              position: 'absolute',
              width: TILE_SIZE / 2,
              height: TILE_SIZE / 2,
              left: heart.x * TILE_SIZE + TILE_SIZE / 4,
              top: heart.y * TILE_SIZE + TILE_SIZE / 4,
              backgroundColor: 'red',
              borderRadius: '50%',
              boxShadow: '0 0 5px white',
            }}
          ></div>
        ))}
        <Pacman x={pacmanPos.x} y={pacmanPos.y} tileSize={TILE_SIZE} />
        {ghostPos.map((ghost, idx) => (
          <Ghost key={idx} x={ghost.x} y={ghost.y} tileSize={TILE_SIZE} />
        ))}
      </div>
    </div>
  );
}
