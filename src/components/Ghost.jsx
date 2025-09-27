import React from 'react';

export default function Ghost({ x, y, tileSize }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x * tileSize,
        top: y * tileSize,
        fontSize: tileSize,
        pointerEvents: 'none',
      }}
    >
      👻
    </div>
  );
}
