/**
 * A minimal, respectful line-art silhouette for the hero section —
 * a crowned figure with a bow, rendered as gold linework with a soft
 * halo glow. Deliberately abstract/iconographic rather than a detailed
 * likeness, so it reads as elegant symbolism, not a literal depiction.
 */
export default function RamSvg({ className = '' }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Stylized illustration honoring Shri Ram"
    >
      <defs>
        <radialGradient id="ramGlow" cx="50%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#c8a45e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c8a45e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ramStroke" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e9c98a" />
          <stop offset="100%" stopColor="#c8a45e" />
        </linearGradient>
      </defs>

      {/* halo glow */}
      <circle cx="200" cy="150" r="140" fill="url(#ramGlow)" />

      {/* halo ring behind the crown */}
      <circle
        cx="200"
        cy="120"
        r="72"
        fill="none"
        stroke="url(#ramStroke)"
        strokeWidth="1.5"
        opacity="0.5"
      />

      {/* crown (mukut) — stylized triangular peaks */}
      <path
        d="M150 108
           L162 78 L176 100
           L188 68 L200 96
           L212 68 L224 100
           L238 78 L250 108
           Z"
        fill="none"
        stroke="url(#ramStroke)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="200" cy="72" r="5" fill="url(#ramStroke)" />

      {/* head + face, abstracted as a simple oval with minimal features */}
      <ellipse
        cx="200"
        cy="150"
        rx="40"
        ry="46"
        fill="none"
        stroke="url(#ramStroke)"
        strokeWidth="3"
      />

      {/* shoulders / torso, draped garment lines */}
      <path
        d="M130 340
           C130 260 160 214 200 214
           C240 214 270 260 270 340"
        fill="none"
        stroke="url(#ramStroke)"
        strokeWidth="3"
      />
      <path
        d="M150 340 C150 275 172 235 200 232 C228 235 250 275 250 340"
        fill="none"
        stroke="url(#ramStroke)"
        strokeWidth="1.5"
        opacity="0.5"
      />

      {/* bow, arcing behind the figure */}
      <path
        d="M96 130
           C60 180 60 260 96 320"
        fill="none"
        stroke="url(#ramStroke)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="96"
        y1="130"
        x2="96"
        y2="320"
        stroke="url(#ramStroke)"
        strokeWidth="1"
        opacity="0.6"
        strokeDasharray="2 6"
      />

      {/* arrow, diagonal accent */}
      <line
        x1="150"
        y1="255"
        x2="260"
        y2="215"
        stroke="url(#ramStroke)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M254 210 L266 213 L258 223 Z"
        fill="url(#ramStroke)"
      />

      {/* base line / ground */}
      <line x1="110" y1="344" x2="290" y2="344" stroke="url(#ramStroke)" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}
