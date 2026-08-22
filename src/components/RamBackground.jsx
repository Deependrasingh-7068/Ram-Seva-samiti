/**
 * Extremely subtle "राम" watermark, tiled across a section's background.
 * Opacity is set in CSS (.ram-watermark span) at ~3.5% — never distracting.
 * Purely decorative: aria-hidden so screen readers skip it.
 */
export default function RamBackground({ rows = 4, cols = 3 }) {
  const cells = Array.from({ length: rows * cols });

  return (
    <div className="ram-watermark" aria-hidden="true">
      {cells.map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const top = `${(row / rows) * 100 + 8}%`;
        const left = `${(col / cols) * 100 + (row % 2 === 0 ? 4 : 14)}%`;
        return (
          <span key={i} style={{ top, left }}>
            राम
          </span>
        );
      })}
    </div>
  );
}
