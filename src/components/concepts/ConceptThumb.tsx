import type { ConceptMeta } from "@/concepts/registry";

/**
 * Kézzel készített, stilizált "poszter" thumbnail minden koncepcióhoz.
 * Nem screenshot: a koncepció palettáját és layout-karakterét idézi.
 */
export function ConceptThumb({ concept }: { concept: ConceptMeta }) {
  const [bg, fg, accent, soft] = concept.palette;
  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden"
      style={{ backgroundColor: bg, color: fg }}
      aria-hidden
    >
      <svg viewBox="0 0 320 200" className="h-full w-full" role="img">
        <Layout concept={concept} bg={bg} fg={fg} accent={accent} soft={soft} />
      </svg>
    </div>
  );
}

function Shirt({ x, y, s, fill, stroke }: { x: number; y: number; s: number; fill: string; stroke?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M20 8 L34 2 Q40 8 46 2 L60 8 L72 20 L62 30 L58 26 L58 68 L22 68 L22 26 L18 30 L8 20 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={stroke ? 1.2 : 0}
        strokeLinejoin="round"
      />
    </g>
  );
}

function Layout({ concept, bg, fg, accent, soft }: { concept: ConceptMeta; bg: string; fg: string; accent: string; soft: string }) {
  switch (concept.number) {
    case "01":
      return (
        <>
          <rect x="0" y="0" width="320" height="200" fill={bg} />
          <rect x="24" y="22" width="60" height="4" fill={fg} />
          <rect x="24" y="60" width="150" height="14" fill={fg} />
          <rect x="24" y="82" width="110" height="14" fill={fg} />
          <rect x="24" y="112" width="70" height="6" fill={accent} />
          <Shirt x={200} y={40} s={1.3} fill={soft} stroke={fg} />
        </>
      );
    case "02":
      return (
        <>
          <rect width="320" height="200" fill={bg} />
          <rect x="20" y="24" width="180" height="26" fill={accent} />
          <rect x="20" y="58" width="130" height="26" fill={fg} />
          <rect x="176" y="70" width="120" height="100" fill={soft} />
          <Shirt x={196} y={86} s={1.05} fill={bg} stroke={fg} />
          <g transform="rotate(-12 60 140)">
            <rect x="24" y="126" width="80" height="26" fill={accent} />
          </g>
          <rect x="120" y="150" width="46" height="14" fill={fg} />
        </>
      );
    case "03":
      return (
        <>
          <defs>
            <radialGradient id={`g${concept.number}`} cx="50%" cy="45%" r="60%">
              <stop offset="0" stopColor={soft} stopOpacity="0.6" />
              <stop offset="1" stopColor={bg} />
            </radialGradient>
          </defs>
          <rect width="320" height="200" fill={`url(#g${concept.number})`} />
          <Shirt x={116} y={40} s={1.6} fill={soft} stroke={accent} />
          <rect x="24" y="160" width="90" height="6" fill={fg} />
          <rect x="206" y="160" width="90" height="6" fill={fg} />
        </>
      );
    case "04":
      return (
        <>
          <rect width="320" height="200" fill={bg} />
          <path d="M0 150 Q80 120 160 150 T320 150" stroke={accent} strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
          <path d="M0 165 Q80 135 160 165 T320 165" stroke={soft} strokeWidth="1.5" fill="none" />
          <rect x="24" y="30" width="120" height="12" fill={fg} />
          <rect x="24" y="50" width="80" height="12" fill={fg} />
          <rect x="24" y="76" width="60" height="5" fill={accent} />
          <rect x="190" y="26" width="106" height="110" fill={soft} />
          <Shirt x={206} y={44} s={1.05} fill={bg} stroke={fg} />
        </>
      );
    case "05":
      return (
        <>
          <rect width="320" height="200" fill={bg} />
          <ellipse cx="160" cy="112" rx="110" ry="40" fill={accent} opacity="0.12" />
          <Shirt x={116} y={40} s={1.4} fill={soft} stroke={accent} />
          <rect x="20" y="24" width="90" height="6" fill={fg} />
          <rect x="20" y="36" width="60" height="4" fill={accent} />
          <rect x="230" y="150" width="70" height="4" fill={fg} />
          <rect x="230" y="160" width="50" height="4" fill={fg} opacity="0.6" />
        </>
      );
    case "06":
      return (
        <>
          <rect width="320" height="200" fill={bg} />
          <rect x="24" y="18" width="272" height="2" fill={fg} />
          <rect x="120" y="26" width="80" height="12" fill={fg} />
          <rect x="24" y="50" width="130" height="130" fill={soft} />
          <Shirt x={44} y={70} s={1.2} fill={bg} stroke={fg} />
          <rect x="170" y="52" width="126" height="10" fill={fg} />
          <rect x="170" y="70" width="110" height="10" fill={fg} />
          <rect x="170" y="94" width="126" height="3" fill={fg} opacity="0.5" />
          <rect x="170" y="102" width="120" height="3" fill={fg} opacity="0.5" />
          <rect x="170" y="110" width="100" height="3" fill={fg} opacity="0.5" />
          <rect x="170" y="140" width="40" height="6" fill={accent} />
        </>
      );
    case "07":
      return (
        <>
          <rect width="320" height="200" fill={bg} />
          <rect x="0" y="0" width="107" height="200" fill={bg} />
          <rect x="107" y="0" width="106" height="200" fill={accent} />
          <rect x="213" y="0" width="107" height="200" fill={soft} />
          <rect x="16" y="150" width="80" height="18" fill={fg} />
          <Shirt x={128} y={50} s={1.0} fill={bg} />
          <Shirt x={236} y={50} s={1.0} fill={bg} />
          <Shirt x={20} y={50} s={1.0} fill={fg} />
        </>
      );
    case "08":
      return (
        <>
          <rect width="320" height="200" fill={bg} />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={32 * (i + 1)} y1="0" x2={32 * (i + 1)} y2="200" stroke={fg} strokeOpacity="0.12" />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={40 * (i + 1)} x2="320" y2={40 * (i + 1)} stroke={fg} strokeOpacity="0.12" />
          ))}
          <rect x="32" y="40" width="128" height="8" fill={fg} />
          <rect x="32" y="56" width="90" height="4" fill={fg} opacity="0.6" />
          <rect x="192" y="40" width="96" height="120" fill="none" stroke={fg} strokeWidth="1.5" />
          <Shirt x={206} y={60} s={0.95} fill={soft} stroke={fg} />
          <rect x="32" y="120" width="60" height="16" fill={accent} />
          <rect x="32" y="150" width="120" height="4" fill={fg} opacity="0.6" />
        </>
      );
    case "09":
      return (
        <>
          <rect width="320" height="200" fill={bg} />
          <Shirt x={110} y={30} s={1.5} fill="#ffffff" stroke={fg} />
          <circle cx="60" cy="60" r="10" fill={accent} />
          <circle cx="60" cy="88" r="10" fill={soft} />
          <circle cx="60" cy="116" r="10" fill={fg} />
          <circle cx="60" cy="144" r="10" fill="#F2C230" />
          <rect x="230" y="60" width="60" height="60" rx="12" fill={accent} opacity="0.9" />
          <rect x="230" y="136" width="60" height="16" rx="8" fill={fg} />
        </>
      );
    default:
      return (
        <>
          <rect width="320" height="200" fill={bg} />
          <ellipse cx="160" cy="150" rx="120" ry="30" fill={soft} opacity="0.12" />
          <Shirt x={108} y={30} s={1.6} fill={fg === "#232323" ? "#2a2a2a" : soft} stroke={accent} />
          <rect x="30" y="160" width="60" height="1.5" fill={accent} />
          <rect x="230" y="160" width="60" height="1.5" fill={accent} />
          <rect x="120" y="176" width="80" height="4" fill={soft} />
        </>
      );
  }
}
