import { PipoArt } from '@/components/brand/Pipo';
import { Chicken, Cow, Dog, Pig, Sheep } from '@/illustrations/animals';
import { Ball, Rocket, Teddy } from '@/illustrations/toys';
import { starPoints } from '@/utils/geometry';

/*
 * Desenhos das imagens do quebra-cabeça, todos em 300×300 e com coisas
 * diferentes em cada canto — assim cada peça tem "pistas" próprias de onde
 * se encaixa. A lista de imagens (nomes e ordem) fica em `scenes.ts`.
 */

const INK = '#2b2f45';

function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#ffffff">
      <ellipse cx="22" cy="24" rx="22" ry="14" />
      <ellipse cx="48" cy="16" rx="22" ry="17" />
      <ellipse cx="70" cy="26" rx="17" ry="12" />
      <rect x="10" y="24" width="68" height="14" rx="7" />
    </g>
  );
}

function Sun({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M0-42v-9M0 42v9M-42 0h-9M42 0h9M-30-30l-6-6M30 30l6 6M-30 30l-6 6M30-30l6-6"
        stroke="#ffcf33"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle r="30" fill="#ffd95a" />
    </g>
  );
}

function Blossom({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g fill={color}>
        <circle cx="0" cy="-5" r="4.2" />
        <circle cx="5" cy="-1" r="4.2" />
        <circle cx="3" cy="5" r="4.2" />
        <circle cx="-3" cy="5" r="4.2" />
        <circle cx="-5" cy="-1" r="4.2" />
      </g>
      <circle r="3.2" fill="#ffd95a" />
    </g>
  );
}

function Wheel({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={INK} />
      <circle cx={x} cy={y} r={r * 0.4} fill="#d8dce8" />
    </g>
  );
}

/** O Pipo no céu, com sol e arco-íris. */
export function PipoScene() {
  return (
    <g>
      <rect width="300" height="300" fill="#bfe3ff" />
      <Sun x={54} y={56} />
      <Cloud x={196} y={30} scale={1.1} />
      <Cloud x={8} y={150} scale={0.7} />
      {/* Arco-íris */}
      <g fill="none" strokeWidth="13">
        <path d="M14 300a136 136 0 0 1 272 0" stroke="#f0524f" />
        <path d="M27 300a123 123 0 0 1 246 0" stroke="#ffb534" />
        <path d="M40 300a110 110 0 0 1 220 0" stroke="#ffe066" />
        <path d="M53 300a97 97 0 0 1 194 0" stroke="#5fcb8e" />
        <path d="M66 300a84 84 0 0 1 168 0" stroke="#62aef5" />
      </g>
      {/* Passarinhos */}
      <path
        d="M232 108q7-8 13 0 6-8 13 0M254 132q6-7 11 0 5-7 11 0"
        fill="none"
        stroke="#45517a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Morros */}
      <path d="M0 262q70-34 150-8t150-14v60H0z" fill="#8edda9" />
      <path d="M0 284q90-26 170-6t130-8v30H0z" fill="#5fcb8e" />
      <Blossom x={34} y={272} color="#ffaecb" />
      <Blossom x={262} y={266} color="#ffffff" />
      <Blossom x={226} y={282} color="#c9b6ff" />
      <g transform="translate(92 62) scale(0.74)">
        <PipoArt />
      </g>
    </g>
  );
}

const FENCE_POSTS = [8, 50, 92, 134, 176, 218, 260];

/** Um cachorrinho sentado no jardim. */
export function DogScene() {
  return (
    <g>
      <rect width="300" height="300" fill="#cdebff" />
      <Sun x={250} y={50} />
      <Cloud x={14} y={24} />
      {/* Cerca */}
      <g fill="#ffffff" stroke="#d3dae8" strokeWidth="2">
        <rect x="-4" y="150" width="308" height="11" />
        <rect x="-4" y="186" width="308" height="11" />
        {FENCE_POSTS.map((x) => (
          <path key={x} d={`M${x} 226v-92l15-14 15 14v92z`} strokeLinejoin="round" />
        ))}
      </g>
      {/* Grama */}
      <path d="M0 216q75-14 150 0t150 0v84H0z" fill="#8edda9" />
      <path d="M0 268q75-10 150 0t150 0v32H0z" fill="#5fcb8e" />
      <Blossom x={30} y={232} color="#ffaecb" />
      <Blossom x={272} y={236} color="#ffffff" />
      {/* Rabo, corpo e patas */}
      <path d="M192 236q34-4 32-40" fill="none" stroke="#c98f5e" strokeWidth="13" strokeLinecap="round" />
      <ellipse cx="150" cy="228" rx="47" ry="50" fill="#e0b080" />
      <ellipse cx="150" cy="240" rx="26" ry="34" fill="#f8e6cc" />
      <ellipse cx="110" cy="272" rx="19" ry="11" fill="#c98f5e" />
      <ellipse cx="190" cy="272" rx="19" ry="11" fill="#c98f5e" />
      <rect x="127" y="226" width="17" height="48" rx="8.5" fill="#e0b080" />
      <rect x="156" y="226" width="17" height="48" rx="8.5" fill="#e0b080" />
      <ellipse cx="135.5" cy="274" rx="12" ry="8" fill="#f8e6cc" />
      <ellipse cx="164.5" cy="274" rx="12" ry="8" fill="#f8e6cc" />
      {/* Cabeça */}
      <g transform="translate(84 78) scale(1.1)">
        <Dog />
      </g>
      {/* Coleira */}
      <path d="M124 196q26 14 52 0" fill="none" stroke="#f0524f" strokeWidth="9" strokeLinecap="round" />
      <circle cx="150" cy="208" r="6.5" fill="#ffd95a" stroke="#e6b422" strokeWidth="1.5" />
      {/* Bola e osso */}
      <g transform="translate(16 234) scale(0.46)">
        <Ball />
      </g>
      <g transform="translate(226 262) rotate(-14)" fill="#ffffff" stroke="#d3dae8" strokeWidth="2">
        <circle cx="6" cy="5" r="6.5" />
        <circle cx="6" cy="17" r="6.5" />
        <circle cx="50" cy="5" r="6.5" />
        <circle cx="50" cy="17" r="6.5" />
        <rect x="6" y="5" width="44" height="12" stroke="none" />
        <path d="M11 5h34M11 17h34" />
      </g>
    </g>
  );
}

const STARFISH = starPoints(112, 276, 20, 9);

/** Peixinhos no fundo do mar. */
export function SeaScene() {
  return (
    <g>
      <rect width="300" height="300" fill="#7cc8f2" />
      <path d="M0 0h300v30q-38 16-75 0t-75 0-75 0-75 0z" fill="#a8dcf7" />
      {/* Areia */}
      <path d="M0 256q75-18 150-4t150-6v54H0z" fill="#f6dfa6" />
      {/* Algas */}
      <g fill="none" strokeLinecap="round">
        <path d="M30 264q-16-30 0-58t0-58" stroke="#3fae6a" strokeWidth="11" />
        <path d="M56 264q14-24 0-48t6-42" stroke="#5fcb8e" strokeWidth="10" />
      </g>
      {/* Coral */}
      <path
        d="M258 264v-60M258 236q-24-6-24-34M258 224q24-8 22-38"
        fill="none"
        stroke="#ff8fb0"
        strokeWidth="13"
        strokeLinecap="round"
      />
      {/* Peixe grande */}
      <path d="M92 150L44 110q12 40 0 80z" fill="#f0703a" />
      <path d="M128 110q26-38 58-6z" fill="#f0703a" />
      <path d="M148 190q12 24 32 14l-10-22z" fill="#f0703a" />
      <ellipse cx="160" cy="150" rx="76" ry="48" fill="#ff9838" />
      <path
        d="M136 106q18 44 0 88M174 104q18 46 0 92"
        fill="none"
        stroke="#ffffff"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <circle cx="196" cy="164" r="8" fill="#ff7a93" opacity="0.5" />
      <circle cx="208" cy="138" r="13" fill="#ffffff" />
      <circle cx="211" cy="138" r="6.5" fill={INK} />
      <circle cx="209" cy="135.5" r="2.2" fill="#ffffff" />
      <path d="M214 166q10 2 16-7" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {/* Bolhas */}
      <g fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.9">
        <circle cx="256" cy="98" r="10" />
        <circle cx="272" cy="64" r="7" />
        <circle cx="246" cy="52" r="4.5" />
      </g>
      {/* Peixinhos */}
      <g transform="translate(34 58)">
        <path d="M-2 12l-18-11v22z" fill="#8b6ce0" />
        <ellipse cx="14" cy="12" rx="22" ry="13" fill="#ac92f5" />
        <circle cx="25" cy="9" r="2.6" fill={INK} />
      </g>
      <g transform="translate(222 198)">
        <path d="M32 12l18-11v22z" fill="#f2b600" />
        <ellipse cx="16" cy="12" rx="22" ry="13" fill="#ffd95a" />
        <circle cx="6" cy="9" r="2.6" fill={INK} />
      </g>
      {/* Estrela-do-mar e concha */}
      <polygon points={STARFISH} fill="#ff8fb0" stroke="#e86a9a" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M182 286a17 17 0 0 1 34 0z" fill="#fff6ea" stroke="#e8c29b" strokeWidth="2" strokeLinejoin="round" />
      <path d="M199 286v-15M190 286l-3-11M208 286l3-11" stroke="#e8c29b" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

const SPACE_STARS: ReadonlyArray<readonly [number, number, number]> = [
  [20, 20, 2.2],
  [128, 26, 1.8],
  [176, 54, 2.4],
  [290, 110, 2],
  [14, 138, 2.2],
  [96, 118, 1.6],
  [280, 22, 1.8],
  [36, 262, 2],
  [270, 226, 2.2],
  [206, 16, 1.6],
  [118, 222, 1.8],
];

/** Estrela de quatro pontas. `size` é a distância do centro até a ponta. */
function Sparkle({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <path
      d="M0-10l2.8 7.2 7.2 2.8-7.2 2.8L0 10l-2.8-7.2L-10 0l7.2-2.8z"
      transform={`translate(${x} ${y}) scale(${size / 10})`}
      fill="#ffd95a"
    />
  );
}

/** Um foguete viajando pelo espaço. */
export function RocketScene() {
  return (
    <g>
      <rect width="300" height="300" fill="#2b3566" />
      <g fill="#fff6d1">
        {SPACE_STARS.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>
      <Sparkle x={228} y={128} size={11} />
      <Sparkle x={60} y={176} size={9} />
      <Sparkle x={150} y={18} size={7} />
      {/* Planeta com anel */}
      <circle cx="62" cy="66" r="32" fill="#ff9eb5" />
      <path
        d="M36 52q26 10 52-2M34 74q28 10 56-4"
        fill="none"
        stroke="#e86a9a"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <ellipse
        cx="62"
        cy="66"
        rx="52"
        ry="11"
        transform="rotate(-18 62 66)"
        fill="none"
        stroke="#ffd95a"
        strokeWidth="6"
      />
      {/* Lua */}
      <circle cx="246" cy="58" r="27" fill="#fff1b8" />
      <g fill="#f2dc8a">
        <circle cx="237" cy="50" r="6.5" />
        <circle cx="255" cy="67" r="5" />
        <circle cx="254" cy="44" r="3.2" />
      </g>
      {/* Terra */}
      <circle cx="150" cy="424" r="176" fill="#62aef5" />
      <circle cx="150" cy="424" r="176" fill="none" stroke="#a9d6ff" strokeWidth="5" opacity="0.7" />
      <path d="M62 290q24-26 54-14 16 12-6 34H70z" fill="#5fcb8e" />
      <path d="M176 262q34-12 62 10 6 18-22 28h-34z" fill="#5fcb8e" />
      {/* Disco voador */}
      <g transform="translate(26 206)">
        <path d="M13 17a15 15 0 0 1 30 0z" fill="#cdebff" />
        <ellipse cx="28" cy="20" rx="28" ry="9" fill="#ac92f5" />
        <circle cx="13" cy="21" r="2.6" fill="#ffd95a" />
        <circle cx="28" cy="23" r="2.6" fill="#ffd95a" />
        <circle cx="43" cy="21" r="2.6" fill="#ffd95a" />
      </g>
      {/* Foguete */}
      <g transform="translate(150 146) rotate(24) scale(1.55) translate(-60 -58)">
        <Rocket />
      </g>
    </g>
  );
}

const SLEEPERS = [6, 36, 66, 96, 126, 156, 186, 216, 246, 276];

/** Um trenzinho de brinquedo passeando pelos morros. */
export function TrainScene() {
  return (
    <g>
      <rect width="300" height="300" fill="#cdebff" />
      <Sun x={50} y={52} />
      <Cloud x={118} y={22} scale={0.8} />
      <path d="M0 196q80-50 160-14t140-22v140H0z" fill="#c3eed3" />
      <path d="M0 240q90-22 170-4t130-10v74H0z" fill="#8edda9" />
      {/* Árvores */}
      <rect x="34" y="150" width="11" height="36" rx="4" fill="#8a5a3c" />
      <g fill="#5fcb8e">
        <circle cx="39" cy="132" r="24" />
        <circle cx="24" cy="146" r="14" />
        <circle cx="54" cy="146" r="14" />
      </g>
      {/* Carga do vagão */}
      <g transform="translate(36 150) scale(0.44)">
        <Teddy />
      </g>
      <g transform="translate(84 162) scale(0.34)">
        <Ball />
      </g>
      {/* Vagão */}
      <rect x="26" y="196" width="100" height="48" rx="8" fill="#ffcf33" />
      <rect x="26" y="212" width="100" height="10" fill="#f2b600" />
      <path d="M126 230h22" stroke="#45517a" strokeWidth="6" strokeLinecap="round" />
      {/* Locomotiva */}
      <rect x="198" y="186" width="76" height="58" rx="14" fill="#f0524f" />
      <path d="M234 188v54" stroke="#c93c3a" strokeWidth="6" />
      <path d="M240 188v-26h-6v-10h28v10h-6v26z" fill={INK} />
      <rect x="146" y="150" width="58" height="94" rx="8" fill="#2670d3" />
      <rect x="138" y="142" width="74" height="14" rx="7" fill="#17437f" />
      <rect x="158" y="166" width="34" height="30" rx="6" fill="#fff6d1" />
      <circle cx="272" cy="204" r="7" fill="#ffd95a" />
      <path d="M274 244h18l-18-22z" fill="#45517a" />
      {/* Fumaça */}
      <g fill="#ffffff">
        <circle cx="246" cy="130" r="12" />
        <circle cx="228" cy="108" r="15" />
        <circle cx="204" cy="86" r="18" />
      </g>
      {/* Trilho */}
      <g fill="#a8683c">
        {SLEEPERS.map((x) => (
          <rect key={x} x={x} y="266" width="14" height="9" rx="2" />
        ))}
      </g>
      <path d="M0 265h300" stroke="#5b3a21" strokeWidth="5" />
      <Wheel x={52} y={250} r={14} />
      <Wheel x={100} y={250} r={14} />
      <Wheel x={172} y={246} r={18} />
      <Wheel x={226} y={250} r={14} />
      <Wheel x={258} y={250} r={14} />
      <Blossom x={22} y={288} color="#ffaecb" />
      <Blossom x={150} y={290} color="#ffffff" />
      <Blossom x={280} y={288} color="#c9b6ff" />
    </g>
  );
}

const FARM_POSTS = [6, 56, 106, 156, 206, 256];

/** A fazenda, com celeiro, árvore e bichinhos. */
export function FarmScene() {
  return (
    <g>
      <rect width="300" height="300" fill="#cdebff" />
      <Sun x={252} y={48} />
      <Cloud x={150} y={18} scale={0.7} />
      <path d="M0 176q80-24 160-6t140-10v140H0z" fill="#b6ecca" />
      {/* Celeiro */}
      <rect x="24" y="112" width="116" height="96" fill="#f0524f" />
      <path d="M14 116l68-58 68 58z" fill="#b93a3a" stroke="#b93a3a" strokeWidth="6" strokeLinejoin="round" />
      <circle cx="82" cy="96" r="12" fill="#fff6d1" stroke="#ffffff" strokeWidth="4" />
      <rect x="58" y="148" width="48" height="60" fill="#fff6ea" stroke="#ffffff" strokeWidth="4" />
      <path d="M58 148l48 60M106 148l-48 60" stroke="#f0524f" strokeWidth="5" />
      {/* Árvore com maçãs */}
      <rect x="227" y="124" width="14" height="62" rx="5" fill="#8a5a3c" />
      <g fill="#5fcb8e">
        <circle cx="234" cy="100" r="34" />
        <circle cx="208" cy="114" r="22" />
        <circle cx="260" cy="114" r="22" />
      </g>
      <g fill="#f0524f">
        <circle cx="220" cy="94" r="6" />
        <circle cx="246" cy="86" r="6" />
        <circle cx="252" cy="112" r="6" />
        <circle cx="212" cy="116" r="6" />
      </g>
      {/* Vaca atrás da cerca */}
      <g transform="translate(142 128) scale(0.68)">
        <Cow />
      </g>
      {/* Cerca */}
      <g fill="#fff6ea" stroke="#e2c9a4" strokeWidth="2">
        <rect x="-4" y="216" width="308" height="9" />
        <rect x="-4" y="236" width="308" height="9" />
        {FARM_POSTS.map((x) => (
          <rect key={x} x={x} y="206" width="13" height="48" rx="4" />
        ))}
      </g>
      <path d="M0 246q80-10 150 0t150-4v58H0z" fill="#7dd6a0" />
      {/* Bichinhos na frente */}
      <g transform="translate(14 232) scale(0.54)">
        <Pig />
      </g>
      <g transform="translate(118 234) scale(0.52)">
        <Sheep />
      </g>
      <g transform="translate(222 232) scale(0.54)">
        <Chicken />
      </g>
    </g>
  );
}
