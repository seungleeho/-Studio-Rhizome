export interface RainDrop {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  radius: number; // for ripple state
  rippling: boolean;
  rippleProgress: number; // 0..1
  touchX: number;
  touchY: number;
}

const GRAVITY = 0.45;
const WIND = 0.08;

export function createDrop(id: number, screenWidth: number): RainDrop {
  return {
    id,
    x: Math.random() * screenWidth,
    y: -Math.random() * 200,
    vx: WIND + (Math.random() - 0.5) * 0.3,
    vy: 6 + Math.random() * 8,
    length: 12 + Math.random() * 22,
    opacity: 0.3 + Math.random() * 0.5,
    radius: 0,
    rippling: false,
    rippleProgress: 0,
    touchX: 0,
    touchY: 0,
  };
}

export function stepDrop(
  drop: RainDrop,
  screenWidth: number,
  screenHeight: number,
  touches: Array<{ x: number; y: number }>,
  dt: number
): RainDrop {
  if (drop.rippling) {
    const progress = drop.rippleProgress + dt * 0.04;
    if (progress >= 1) {
      return createDrop(drop.id, screenWidth);
    }
    return { ...drop, rippleProgress: progress, radius: progress * 40 };
  }

  let { x, y, vx, vy } = drop;
  vy += GRAVITY * dt;
  vx += (Math.random() - 0.5) * 0.05;
  x += vx * dt;
  y += vy * dt;

  // Wrap horizontally
  if (x < -10) x = screenWidth + 10;
  if (x > screenWidth + 10) x = -10;

  // Check touch deflection
  for (const touch of touches) {
    const dx = x - touch.x;
    const dy = y - touch.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 50) {
      return {
        ...drop,
        x,
        y,
        vx,
        vy,
        rippling: true,
        rippleProgress: 0,
        touchX: touch.x,
        touchY: touch.y,
        radius: 0,
      };
    }
  }

  if (y > screenHeight + drop.length) {
    return createDrop(drop.id, screenWidth);
  }

  return { ...drop, x, y, vx, vy };
}
