/* Frutas em 120×120, no mesmo estilo arredondado dos animais. */

export function Apple() {
  return (
    <g>
      <path
        d="M60 40c-12-11-38-6-38 23 0 26 20 44 38 38 18 6 38-12 38-38 0-29-26-34-38-23z"
        fill="#f0524f"
      />
      <ellipse
        cx="40"
        cy="60"
        rx="6"
        ry="11"
        transform="rotate(18 40 60)"
        fill="#ffffff"
        opacity="0.35"
      />
      <path
        d="M60 41q-1-12 6-21"
        fill="none"
        stroke="#7a4a2a"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M66 29q12-14 26-6-10 14-26 6z" fill="#5fcb6e" />
    </g>
  );
}

export function Banana() {
  return (
    <g>
      <path
        d="M22 44c8 36 42 58 80 44 5-2 5-9 0-10-28 4-54-14-62-44-2-7-20-1-18 10z"
        fill="#ffd95a"
        stroke="#e6b422"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M33 54c9 22 32 36 60 31"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path d="M22 41q1-9 9-10 7-1 9 4-8-3-18 6z" fill="#8a5a3c" />
      <circle cx="103" cy="83" r="3.5" fill="#8a5a3c" />
    </g>
  );
}

export function Strawberry() {
  return (
    <g>
      <path d="M60 106C36 94 22 68 27 50c4-14 62-14 66 0 5 18-9 44-33 56z" fill="#f0524f" />
      <g fill="#ffe08a">
        <ellipse cx="44" cy="60" rx="2.2" ry="3.2" />
        <ellipse cx="60" cy="57" rx="2.2" ry="3.2" />
        <ellipse cx="76" cy="60" rx="2.2" ry="3.2" />
        <ellipse cx="51" cy="73" rx="2.2" ry="3.2" />
        <ellipse cx="69" cy="73" rx="2.2" ry="3.2" />
        <ellipse cx="60" cy="88" rx="2.2" ry="3.2" />
        <ellipse cx="38" cy="74" rx="2.2" ry="3.2" />
        <ellipse cx="82" cy="74" rx="2.2" ry="3.2" />
      </g>
      <path
        d="M36 44l10-11 14 8 14-8 10 11-12 7-12-4-12 4z"
        fill="#5fcb6e"
        stroke="#5fcb6e"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M60 38V25" stroke="#3f9e52" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

const GRAPES: ReadonlyArray<readonly [number, number]> = [
  [38, 46],
  [60, 44],
  [82, 46],
  [49, 65],
  [71, 65],
  [60, 85],
];

export function Grapes() {
  return (
    <g>
      <path d="M60 32V15" stroke="#7a4a2a" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M62 21q14-13 27-3-10 13-27 3z" fill="#5fcb6e" />
      {GRAPES.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="13" fill="#8b5cf6" stroke="#7445e0" strokeWidth="1.5" />
          <circle cx={x - 4} cy={y - 4.5} r="3.2" fill="#ffffff" opacity="0.4" />
        </g>
      ))}
    </g>
  );
}

export function Orange() {
  return (
    <g>
      <circle cx="60" cy="66" r="38" fill="#ff9838" stroke="#e67c1c" strokeWidth="2" />
      <ellipse
        cx="44"
        cy="52"
        rx="7"
        ry="11"
        transform="rotate(30 44 52)"
        fill="#ffffff"
        opacity="0.35"
      />
      <g fill="#e67c1c">
        <circle cx="70" cy="60" r="1.5" />
        <circle cx="79" cy="74" r="1.5" />
        <circle cx="63" cy="86" r="1.5" />
        <circle cx="50" cy="76" r="1.5" />
        <circle cx="67" cy="73" r="1.5" />
      </g>
      <path d="M60 30q2-8 8-13" fill="none" stroke="#7a4a2a" strokeWidth="4" strokeLinecap="round" />
      <path d="M65 24q14-12 26-2-10 12-26 2z" fill="#5fcb6e" />
    </g>
  );
}

export function Watermelon() {
  return (
    <g>
      <path d="M10 44a50 50 0 0 0 100 0z" fill="#3f9e52" />
      <path d="M16 44a44 44 0 0 0 88 0z" fill="#e9f7d9" />
      <path d="M21 44a39 39 0 0 0 78 0z" fill="#f0524f" />
      <g fill="#2b2f45">
        <ellipse cx="40" cy="55" rx="2.4" ry="3.8" />
        <ellipse cx="60" cy="53" rx="2.4" ry="3.8" />
        <ellipse cx="80" cy="55" rx="2.4" ry="3.8" />
        <ellipse cx="50" cy="67" rx="2.4" ry="3.8" />
        <ellipse cx="70" cy="67" rx="2.4" ry="3.8" />
      </g>
    </g>
  );
}
