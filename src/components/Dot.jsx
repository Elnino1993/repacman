export default function Dot({ x, y, tileSize }) {
    return (
      <div
        className="dot"
        style={{
          left: `${x * tileSize + 12}px`,
          top: `${y * tileSize + 12}px`,
        }}
      ></div>
    );
  }
  