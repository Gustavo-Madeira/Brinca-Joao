/** Arredonda para uma casa decimal (deixa os SVGs gerados mais enxutos). */
export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Pontos de um polígono regular (para `<polygon points>`), com o primeiro
 * vértice apontando para cima.
 */
export function regularPolygonPoints(
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  rotationDeg = 0,
): string {
  const points: string[] = [];
  for (let i = 0; i < sides; i += 1) {
    const angle = ((-90 + rotationDeg + (360 / sides) * i) * Math.PI) / 180;
    points.push(`${round1(cx + radius * Math.cos(angle))},${round1(cy + radius * Math.sin(angle))}`);
  }
  return points.join(' ');
}

/** Pontos de uma estrela (para `<polygon points>`), com uma ponta para cima. */
export function starPoints(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  tips = 5,
): string {
  const points: string[] = [];
  for (let i = 0; i < tips * 2; i += 1) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = ((-90 + (180 / tips) * i) * Math.PI) / 180;
    points.push(`${round1(cx + radius * Math.cos(angle))},${round1(cy + radius * Math.sin(angle))}`);
  }
  return points.join(' ');
}
