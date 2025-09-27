export default function Pacman({ x, y, tileSize }) {
  return (
    <img
      src="/cat-pacman.png"
      alt="Cat Pacman"
      style={{
        position: 'absolute',
        width: `${tileSize+16}px`,
        height: `${tileSize+16}px`,
        left: `${x * tileSize}px`,
        top: `${y * tileSize}px`,
      }}
    />
  );
}
