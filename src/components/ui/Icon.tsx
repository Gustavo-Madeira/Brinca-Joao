import type { ReactElement } from 'react';

export type IconName =
  | 'arrowLeft'
  | 'arrowRight'
  | 'settings'
  | 'restart'
  | 'hint'
  | 'soundOn'
  | 'soundOff'
  | 'check'
  | 'star'
  | 'play'
  | 'home'
  | 'download'
  | 'trash'
  | 'eraser'
  | 'brush'
  | 'undo'
  | 'close'
  | 'eye'
  | 'eyeOff'
  | 'heart'
  | 'grid'
  | 'info'
  | 'sparkle'
  | 'image'
  | 'calm'
  | 'size'
  | 'level';

/** Desenhos dos ícones, todos em uma grade de 24×24 com traço arredondado. */
const ICONS: Record<IconName, ReactElement> = {
  arrowLeft: (
    <>
      <path d="M19 12H5.5" />
      <path d="M11 6l-6 6 6 6" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12h13.5" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  settings: (
    <>
      <circle
        cx="12"
        cy="12"
        r="8.4"
        strokeWidth="3.2"
        strokeDasharray="3.3 3.3"
        strokeLinecap="butt"
      />
      <circle cx="12" cy="12" r="5.4" strokeWidth="2.6" />
    </>
  ),
  restart: (
    <>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5" />
      <path d="M4.5 4.5v4.8h4.8" />
    </>
  ),
  hint: (
    <>
      <path d="M12 3a6 6 0 0 0-3.7 10.7c.7.6 1.1 1.3 1.2 2.3h5c.1-1 .5-1.7 1.2-2.3A6 6 0 0 0 12 3z" />
      <path d="M9.8 19h4.4" />
      <path d="M10.8 21.5h2.4" />
    </>
  ),
  soundOn: (
    <>
      <path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4H4z" />
      <path d="M15.5 9.2a4 4 0 0 1 0 5.6" />
      <path d="M18 6.7a7.5 7.5 0 0 1 0 10.6" />
    </>
  ),
  soundOff: (
    <>
      <path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4H4z" />
      <path d="M16 9.5l5 5" />
      <path d="M21 9.5l-5 5" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" strokeWidth="2.8" />,
  star: (
    <path
      d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.5l6-.8L12 3.2z"
      fill="currentColor"
    />
  ),
  play: <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />,
  home: (
    <>
      <path d="M3.5 11.5L12 4l8.5 7.5" />
      <path d="M6 10v9.5h12V10" />
      <path d="M10 19.5v-5h4v5" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11" />
      <path d="M7 10.5l5 5 5-5" />
      <path d="M5 20h14" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4.5h6V7" />
      <path d="M6.5 7l1 13h9l1-13" />
      <path d="M10 11v5.5" />
      <path d="M14 11v5.5" />
    </>
  ),
  eraser: (
    <>
      <path d="M8.5 19.5l-4.7-4.7a1.8 1.8 0 0 1 0-2.5l8-8a1.8 1.8 0 0 1 2.5 0l5.9 5.9a1.8 1.8 0 0 1 0 2.5l-6.8 6.8H8.5z" />
      <path d="M8 8.5l7.5 7.5" />
      <path d="M13.4 19.5H20" />
    </>
  ),
  brush: (
    <>
      <path d="M4 20l1.2-4.7L16.4 4.1a2.2 2.2 0 0 1 3.1 0l.4.4a2.2 2.2 0 0 1 0 3.1L8.7 18.8 4 20z" />
      <path d="M14.2 6.3l3.5 3.5" />
    </>
  ),
  undo: (
    <>
      <path d="M8.5 6L4 10.5 8.5 15" />
      <path d="M4 10.5h10a5 5 0 0 1 0 10h-3.5" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M4 4l16 16" />
    </>
  ),
  heart: (
    <path
      d="M12 20.3s-7.8-4.7-7.8-10.3A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 7.8 2.7c0 5.6-7.8 10.3-7.8 10.3z"
      fill="currentColor"
    />
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.8" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" />
      <path d="M12 7.6v.1" strokeWidth="2.8" />
    </>
  ),
  sparkle: (
    <>
      <path d="M11 4l1.7 4.8 4.8 1.7-4.8 1.7L11 17l-1.7-4.8-4.8-1.7 4.8-1.7L11 4z" />
      <path d="M18.5 15.5v4" />
      <path d="M16.5 17.5h4" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M4.5 17L9 12.5l3.5 3.5 2.5-2.5 4.5 4.5" />
    </>
  ),
  calm: <path d="M20 14.3A8.3 8.3 0 1 1 9.7 4 6.6 6.6 0 0 0 20 14.3z" />,
  size: (
    <>
      <path d="M3.5 18.5l4-10 4 10" />
      <path d="M5 15h5" />
      <path d="M13 18.5l3.5-13 3.5 13" strokeWidth="2.6" />
      <path d="M14.2 14.5h4.6" strokeWidth="2.6" />
    </>
  ),
  level: (
    <>
      <path d="M5.5 19.5v-4" strokeWidth="3" />
      <path d="M12 19.5v-9" strokeWidth="3" />
      <path d="M18.5 19.5v-14" strokeWidth="3" />
    </>
  ),
};

interface IconProps {
  name: IconName;
  /** Tamanho em rem (acompanha o ajuste de tamanho do site). */
  size?: number;
  className?: string;
}

/** Ícone decorativo: o texto ao lado (ou o rótulo do botão) é quem o descreve. */
export function Icon({ name, size = 1.5, className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={`${size}rem`}
      height={`${size}rem`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
    >
      {ICONS[name]}
    </svg>
  );
}
