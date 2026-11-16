import { round1 } from '@/utils/geometry';
import { Cheeks, Eye, Eyes, INK, Muzzle } from './parts';

/*
 * Rostinhos de animais, todos em 120×120 e no mesmo estilo: formas
 * arredondadas, olhos ovais com brilho e bochechas rosadas.
 */

export function Dog() {
  return (
    <g>
      {/* Orelhas caídas */}
      <path d="M27 36C12 38 9 66 18 82c6 8 16 2 16-9l3-33z" fill="#8a5a3c" />
      <path d="M93 36c15 2 18 30 9 46-6 8-16 2-16-9l-3-33z" fill="#8a5a3c" />
      <ellipse cx="60" cy="62" rx="37" ry="36" fill="#e0b080" />
      {/* Mancha no olho */}
      <ellipse cx="44" cy="55" rx="12" ry="13" fill="#c98f5e" />
      <ellipse cx="60" cy="79" rx="21" ry="16" fill="#f8e6cc" />
      <Eyes y={56} x1={45} x2={75} />
      <Cheeks y={73} x1={30} x2={90} />
      {/* Língua */}
      <path d="M55 84q5 13 10 0z" fill="#ff7a93" />
      <ellipse cx="60" cy="71" rx="7" ry="5" fill={INK} />
      <Muzzle x={60} y={76} size={1.2} />
    </g>
  );
}

export function Cat() {
  return (
    <g>
      <g fill="#f4a64a" stroke="#f4a64a" strokeWidth="5" strokeLinejoin="round">
        <path d="M25 46l4-34 26 18z" />
        <path d="M95 46l-4-34-26 18z" />
      </g>
      <path d="M32 38l2-17 13 9z" fill="#ffc9d4" />
      <path d="M88 38l-2-17-13 9z" fill="#ffc9d4" />
      <ellipse cx="60" cy="65" rx="38" ry="34" fill="#f4a64a" />
      {/* Listras na testa */}
      <path d="M52 34v9M60 32v11M68 34v9" stroke="#d9822b" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="52" cy="79" rx="11" ry="9" fill="#fff3e0" />
      <ellipse cx="68" cy="79" rx="11" ry="9" fill="#fff3e0" />
      <Eyes y={61} x1={45} x2={75} />
      <Cheeks y={74} x1={30} x2={90} />
      <path
        d="M55.5 71h9l-4.5 5z"
        fill="#ff7a93"
        stroke="#ff7a93"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Muzzle x={60} y={77} size={0.9} />
      {/* Bigodes */}
      <path
        d="M38 76H23M38 81l-14 4M82 76h15M82 81l14 4"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </g>
  );
}

export function Cow() {
  return (
    <g>
      {/* Chifres */}
      <g fill="#f2e2c4" stroke="#d9c7a3" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M38 28q-8-12 1-18 4 8 9 14z" />
        <path d="M82 28q8-12-1-18-4 8-9 14z" />
      </g>
      {/* Orelhas */}
      <ellipse cx="22" cy="46" rx="13" ry="8" transform="rotate(-18 22 46)" fill="#3a3f55" />
      <ellipse cx="98" cy="46" rx="13" ry="8" transform="rotate(18 98 46)" fill="#3a3f55" />
      <ellipse cx="23" cy="46.5" rx="7" ry="4" transform="rotate(-18 23 46.5)" fill="#ffc2cf" />
      <ellipse cx="97" cy="46.5" rx="7" ry="4" transform="rotate(18 97 46.5)" fill="#ffc2cf" />
      <path
        d="M60 22c24 0 34 18 32 40-2 22-12 40-32 40S30 84 28 62c-2-22 8-40 32-40z"
        fill="#ffffff"
        stroke="#d8dce8"
        strokeWidth="2"
      />
      {/* Manchas */}
      <path d="M66 25c13 1 23 12 24 29-9 5-21-1-24-12z" fill="#3a3f55" />
      <path d="M31 64c1-10 8-16 13-11 4 6 0 15-10 19z" fill="#3a3f55" />
      {/* Focinho */}
      <ellipse cx="60" cy="85" rx="26" ry="16" fill="#ffc2cf" />
      <ellipse cx="51" cy="83" rx="3.5" ry="5" fill="#d9778c" />
      <ellipse cx="69" cy="83" rx="3.5" ry="5" fill="#d9778c" />
      <path
        d="M53 93q7 5 14 0"
        fill="none"
        stroke="#b85a70"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* O olho sobre a mancha escura ganha um fundo branco para aparecer. */}
      <circle cx="76" cy="55" r="8" fill="#ffffff" />
      <Eye cx={46} cy={56} r={5} />
      <Eye cx={75} cy={55} r={5} />
    </g>
  );
}

export function Pig() {
  return (
    <g>
      <g fill="#f58da8" stroke="#f58da8" strokeWidth="6" strokeLinejoin="round">
        <path d="M30 40l-6-25 28 12z" />
        <path d="M90 40l6-25-28 12z" />
      </g>
      <circle cx="60" cy="64" r="38" fill="#ffb3c6" />
      <Eyes y={55} x1={44} x2={76} />
      <Cheeks y={77} x1={31} x2={89} color="#ff7f9f" />
      <ellipse cx="60" cy="74" rx="18" ry="13" fill="#f58da8" />
      <ellipse cx="54" cy="74" rx="3.2" ry="4.8" fill="#c9577a" />
      <ellipse cx="66" cy="74" rx="3.2" ry="4.8" fill="#c9577a" />
      <path
        d="M51 92q9 6 18 0"
        fill="none"
        stroke="#c9577a"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </g>
  );
}

export function Duck() {
  return (
    <g>
      {/* Topete */}
      <path d="M54 27q-4-15 6-17-2 6 4 4-2 7 0 13z" fill="#f2b600" />
      <circle cx="60" cy="62" r="37" fill="#ffd95a" />
      <Eyes y={54} x1={46} x2={74} />
      <Cheeks y={68} x1={31} x2={89} />
      {/* Bico */}
      <ellipse cx="60" cy="79" rx="21" ry="11" fill="#ff9838" />
      <path
        d="M41 78q19 8 38 0"
        fill="none"
        stroke="#d9722b"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="55" cy="73" r="1.4" fill="#d9722b" />
      <circle cx="65" cy="73" r="1.4" fill="#d9722b" />
    </g>
  );
}

const WOOL: ReadonlyArray<readonly [number, number, number]> = [
  [22, 60, 13],
  [98, 60, 13],
  [30, 42, 15],
  [90, 42, 15],
  [47, 28, 15],
  [73, 28, 15],
];

const WOOL_TUFT: ReadonlyArray<readonly [number, number, number]> = [
  [49, 45, 10],
  [71, 45, 10],
  [60, 41, 11],
];

/**
 * Tufos de lã: as bolinhas são desenhadas duas vezes — primeiro com contorno,
 * depois só o miolo branco por cima. Assim sobra apenas o contorno de fora,
 * como uma nuvem.
 */
function Fluff({ circles }: { circles: ReadonlyArray<readonly [number, number, number]> }) {
  return (
    <>
      {circles.map(([x, y, r]) => (
        <circle key={`o-${x}-${y}`} cx={x} cy={y} r={r} fill="#ffffff" stroke="#c9d0e0" strokeWidth="4" />
      ))}
      {circles.map(([x, y, r]) => (
        <circle key={`i-${x}-${y}`} cx={x} cy={y} r={r} fill="#ffffff" />
      ))}
    </>
  );
}

export function Sheep() {
  return (
    <g>
      {/* Lã em volta */}
      <Fluff circles={WOOL} />
      {/* Orelhas */}
      <ellipse cx="21" cy="72" rx="12" ry="7" transform="rotate(-24 21 72)" fill="#e9bfa0" />
      <ellipse cx="99" cy="72" rx="12" ry="7" transform="rotate(24 99 72)" fill="#e9bfa0" />
      <ellipse cx="60" cy="70" rx="27" ry="31" fill="#f7dcc4" />
      {/* Topete */}
      <Fluff circles={WOOL_TUFT} />
      <Eyes y={67} x1={50} x2={70} r={4.5} />
      <Cheeks y={79} x1={43} x2={77} r={5.5} />
      <path
        d="M56 80l4 4 4-4M60 84v3"
        fill="none"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M54 90q6 4 12 0" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

export function Frog() {
  return (
    <g>
      <circle cx="38" cy="36" r="17" fill="#5fcb6e" />
      <circle cx="82" cy="36" r="17" fill="#5fcb6e" />
      <ellipse cx="60" cy="70" rx="46" ry="34" fill="#5fcb6e" />
      <ellipse cx="60" cy="87" rx="30" ry="13" fill="#b9edc0" />
      <circle cx="38" cy="36" r="11" fill="#ffffff" />
      <circle cx="82" cy="36" r="11" fill="#ffffff" />
      <Eye cx={39} cy={37} r={5.5} />
      <Eye cx={81} cy={37} r={5.5} />
      <circle cx="54" cy="60" r="1.6" fill="#2b6b3a" />
      <circle cx="66" cy="60" r="1.6" fill="#2b6b3a" />
      <path
        d="M32 72q28 24 56 0"
        fill="none"
        stroke="#2b6b3a"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <Cheeks y={80} x1={27} x2={93} r={6} />
    </g>
  );
}

/** Juba do leão: doze bolinhas em volta do rosto. */
const MANE = Array.from({ length: 12 }, (_, index) => {
  const angle = (index / 12) * Math.PI * 2;
  return { x: round1(60 + Math.cos(angle) * 38), y: round1(62 + Math.sin(angle) * 38) };
});

export function Lion() {
  return (
    <g>
      <g fill="#d9822b">
        {MANE.map((dot) => (
          <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r="13" />
        ))}
        <circle cx="60" cy="62" r="40" />
      </g>
      <circle cx="33" cy="36" r="10" fill="#f7c56b" />
      <circle cx="33" cy="36" r="5" fill="#e8a04a" />
      <circle cx="87" cy="36" r="10" fill="#f7c56b" />
      <circle cx="87" cy="36" r="5" fill="#e8a04a" />
      <circle cx="60" cy="64" r="31" fill="#ffd27a" />
      <ellipse cx="53" cy="79" rx="10" ry="8" fill="#fff1d6" />
      <ellipse cx="67" cy="79" rx="10" ry="8" fill="#fff1d6" />
      <Eyes y={58} x1={47} x2={73} />
      <Cheeks y={72} x1={37} x2={83} r={6} />
      <path
        d="M54 69h12l-6 7z"
        fill="#8a4b2a"
        stroke="#8a4b2a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <Muzzle x={60} y={77} size={0.9} />
    </g>
  );
}

export function Chicken() {
  return (
    <g>
      {/* Crista */}
      <g fill="#f0524f">
        <circle cx="49" cy="24" r="8.5" />
        <circle cx="60" cy="18" r="9.5" />
        <circle cx="71" cy="24" r="8.5" />
      </g>
      <ellipse cx="60" cy="64" rx="35" ry="37" fill="#ffffff" stroke="#d8dce8" strokeWidth="2" />
      {/* Papo */}
      <ellipse cx="60" cy="88" rx="6.5" ry="10" fill="#f0524f" />
      {/* Bico */}
      <path
        d="M51 68h18l-9 13z"
        fill="#ffb534"
        stroke="#ffb534"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <Eyes y={56} x1={46} x2={74} />
      <Cheeks y={71} x1={35} x2={85} />
    </g>
  );
}

export function Horse() {
  return (
    <g>
      <g fill="#a8683c" stroke="#a8683c" strokeWidth="5" strokeLinejoin="round">
        <path d="M40 32L37 8l17 16z" />
        <path d="M80 32l3-24-17 16z" />
      </g>
      <path
        d="M60 18c22 0 31 17 27 40-2 13-5 26-9 36-4 12-32 12-36 0-4-10-7-23-9-36-4-23 5-40 27-40z"
        fill="#b97a45"
      />
      {/* Listra branca */}
      <path d="M56 36q4-4 8 0l-1 30q-3 4-6 0z" fill="#fff6ea" />
      <ellipse cx="60" cy="91" rx="20" ry="15" fill="#e8c29b" />
      <ellipse cx="53" cy="90" rx="3" ry="4.5" fill="#8a5a3c" />
      <ellipse cx="67" cy="90" rx="3" ry="4.5" fill="#8a5a3c" />
      <path
        d="M53 99q7 5 14 0"
        fill="none"
        stroke="#8a5a3c"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Franja */}
      <path d="M47 22q13-14 26 0 0 16-10 14-6-2-9 2-9-4-7-16z" fill="#5b3a21" />
      <Eyes y={57} x1={45} x2={75} />
    </g>
  );
}

export function Monkey() {
  return (
    <g>
      <circle cx="20" cy="62" r="14" fill="#8a5a3c" />
      <circle cx="20" cy="62" r="8" fill="#f2c9a0" />
      <circle cx="100" cy="62" r="14" fill="#8a5a3c" />
      <circle cx="100" cy="62" r="8" fill="#f2c9a0" />
      {/* Topete */}
      <path d="M52 27q8-14 16 0z" fill="#8a5a3c" />
      <circle cx="60" cy="62" r="38" fill="#8a5a3c" />
      <circle cx="47" cy="56" r="16" fill="#f2c9a0" />
      <circle cx="73" cy="56" r="16" fill="#f2c9a0" />
      <ellipse cx="60" cy="78" rx="25" ry="18" fill="#f2c9a0" />
      <Eyes y={56} x1={48} x2={72} />
      <Cheeks y={76} x1={41} x2={79} r={5.5} />
      <circle cx="56.5" cy="71" r="1.6" fill="#8a5a3c" />
      <circle cx="63.5" cy="71" r="1.6" fill="#8a5a3c" />
      <path d="M47 81q13 12 26 0" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
    </g>
  );
}

export function Elephant() {
  return (
    <g>
      <circle cx="24" cy="54" r="23" fill="#9aa7bd" />
      <circle cx="26" cy="54" r="14" fill="#f7b9c6" />
      <circle cx="96" cy="54" r="23" fill="#9aa7bd" />
      <circle cx="94" cy="54" r="14" fill="#f7b9c6" />
      <circle cx="60" cy="52" r="34" fill="#aebacf" />
      {/* Tromba */}
      <path d="M49 64c0 20 1 32 7 40 5 6 14 3 12-4-5-5 1-18 3-36z" fill="#aebacf" />
      <path
        d="M49 70c0 16 1 26 7 34 5 6 14 3 12-4-5-5 1-16 3-30"
        fill="none"
        stroke="#8e9bb3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M52 82h15M54 92h11" stroke="#8e9bb3" strokeWidth="2" strokeLinecap="round" />
      <Eyes y={50} x1={45} x2={75} />
      <Cheeks y={62} x1={37} x2={83} r={6} />
    </g>
  );
}
