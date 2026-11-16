import { starPoints } from '@/utils/geometry';
import { Cheeks, Eyes, INK, Muzzle } from './parts';

/* Brinquedos em 120×120. */

const BALL_STAR = starPoints(60, 63, 26, 11.5);

export function Ball() {
  return (
    <g>
      <circle cx="60" cy="62" r="40" fill="#62aef5" stroke="#3d8fe8" strokeWidth="2" />
      <polygon
        points={BALL_STAR}
        fill="#ffd95a"
        stroke="#ffd95a"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <ellipse
        cx="40"
        cy="42"
        rx="6"
        ry="11"
        transform="rotate(40 40 42)"
        fill="#ffffff"
        opacity="0.45"
      />
    </g>
  );
}

export function Kite() {
  return (
    <g>
      {/* Rabiola */}
      <path
        d="M60 100q12 4 6 10t4 8"
        fill="none"
        stroke="#7c8bae"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M66 108l8-3v8z" fill="#ff8fb0" />
      <path d="M66 108l-8-3v8z" fill="#62aef5" />
      {/* Losango em quatro cores */}
      <path d="M60 8l34 40-34 52-34-52z" fill="#ffd95a" />
      <path d="M60 8l34 40H60z" fill="#ff8fb0" />
      <path d="M60 48h34l-34 52z" fill="#62aef5" />
      <path d="M60 48v52L26 48z" fill="#5fcb8e" />
      <path
        d="M60 8v92M26 48h68"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />
    </g>
  );
}

export function Teddy() {
  return (
    <g>
      <circle cx="31" cy="34" r="14" fill="#b97a45" />
      <circle cx="31" cy="34" r="7.5" fill="#e8c29b" />
      <circle cx="89" cy="34" r="14" fill="#b97a45" />
      <circle cx="89" cy="34" r="7.5" fill="#e8c29b" />
      <circle cx="60" cy="64" r="38" fill="#c98b55" />
      <ellipse cx="60" cy="77" rx="18" ry="14" fill="#f4ddc0" />
      <Eyes y={58} x1={46} x2={74} />
      <Cheeks y={72} x1={33} x2={87} r={6} />
      <ellipse cx="60" cy="71" rx="6" ry="4.5" fill="#5b3a21" />
      <Muzzle x={60} y={76} size={0.8} />
    </g>
  );
}

export function Car() {
  return (
    <g>
      <path
        d="M12 74V62q0-7 8-9l15-3 11-17q4-6 12-6h20q8 0 12 7l9 17q11 2 11 11v12q0 6-6 6H18q-6 0-6-6z"
        fill="#f0524f"
      />
      {/* Janelas */}
      <path d="M50 35h15v16H40z" fill="#d3ecff" />
      <path d="M71 35h8l8 16H71z" fill="#d3ecff" />
      {/* Farol */}
      <rect x="100" y="60" width="8" height="7" rx="3" fill="#ffd95a" />
      <path d="M14 70h8" stroke="#b93a3a" strokeWidth="4" strokeLinecap="round" />
      {/* Rodas */}
      <circle cx="36" cy="82" r="13" fill={INK} />
      <circle cx="36" cy="82" r="5.5" fill="#d8dce8" />
      <circle cx="86" cy="82" r="13" fill={INK} />
      <circle cx="86" cy="82" r="5.5" fill="#d8dce8" />
    </g>
  );
}

export function Rocket() {
  return (
    <g>
      {/* Fogo */}
      <path d="M49 86q11 32 22 0z" fill="#ffb534" />
      <path d="M54.5 86q5.5 18 11 0z" fill="#ffe066" />
      {/* Asas */}
      <path d="M43 62L25 90l19-5z" fill="#f0524f" />
      <path d="M77 62l18 28-19-5z" fill="#f0524f" />
      {/* Corpo */}
      <path
        d="M60 8c18 16 22 44 18 78H42C38 52 42 24 60 8z"
        fill="#ffffff"
        stroke="#d8dce8"
        strokeWidth="2"
      />
      <path d="M60 8c8 7 13 16 16 26H44c3-10 8-19 16-26z" fill="#f0524f" />
      {/* Janela */}
      <circle cx="60" cy="54" r="10.5" fill="#62aef5" stroke="#2670d3" strokeWidth="3" />
      <circle cx="57" cy="51" r="3" fill="#ffffff" opacity="0.6" />
      <path d="M44 78h32" stroke="#d8dce8" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

export function Boat() {
  return (
    <g>
      {/* Mastro e velas */}
      <path d="M60 16v60" stroke="#7a4a2a" strokeWidth="4" strokeLinecap="round" />
      <path d="M55 24v44H26z" fill="#ffffff" stroke="#d8dce8" strokeWidth="2" strokeLinejoin="round" />
      <path d="M65 32v36h27z" fill="#ffd95a" />
      <path d="M60 16l14 5-14 5z" fill="#f0524f" />
      {/* Casco */}
      <path
        d="M16 76h88l-12 20q-2 3-6 3H34q-4 0-6-3z"
        fill="#f0524f"
        stroke="#f0524f"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M24 84h72" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      {/* Ondas */}
      <path
        d="M8 106q9-8 18 0t18 0 18 0 18 0 18 0 14-2"
        fill="none"
        stroke="#62aef5"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </g>
  );
}
