'use strict';

// Cada skin define su propia paleta (9 entradas: 0 = vacío, 1-7 piezas
// clásicas, 8 = Tuerca) y su propia función drawBlock(context, x, y,
// colorIndex, size, alpha). Todas las funciones deben terminar dejando el
// contexto en un estado "limpio" (globalAlpha = 1, sin shadowBlur, sin
// composite operations raras) para que drawNutHole() y el resto del
// renderizado (grid, ghost piece) no se vean afectados por el skin activo.

function skinsDrawBlockRetro(context, x, y, colorIndex, size, alpha) {
  if (!colorIndex) return;
  const color = SKINS.retro.colors[colorIndex];
  context.globalAlpha = alpha ?? 1;
  context.fillStyle = color;
  context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
  // highlight
  context.fillStyle = 'rgba(255,255,255,0.12)';
  context.fillRect(x * size + 1, y * size + 1, size - 2, 4);
  context.globalAlpha = 1;
}

function skinsDrawBlockNeon(context, x, y, colorIndex, size, alpha) {
  if (!colorIndex) return;
  const color = SKINS.neon.colors[colorIndex];
  context.save();
  context.globalAlpha = alpha ?? 1;
  context.shadowColor = color;
  context.shadowBlur = size * 0.6;
  context.fillStyle = color;
  context.fillRect(x * size + 2, y * size + 2, size - 4, size - 4);
  // el highlight no necesita el glow
  context.shadowBlur = 0;
  context.fillStyle = 'rgba(255,255,255,0.25)';
  context.fillRect(x * size + 2, y * size + 2, size - 4, 3);
  context.restore();
  // reseteo explícito: evita que el glow se filtre al grid o al ghost piece
  context.shadowBlur = 0;
  context.shadowColor = 'transparent';
  context.globalAlpha = 1;
}

function skinsDrawBlockPastel(context, x, y, colorIndex, size, alpha) {
  if (!colorIndex) return;
  const color = SKINS.pastel.colors[colorIndex];
  const px = x * size + 2;
  const py = y * size + 2;
  const s = size - 4;
  const radius = Math.min(6, s / 3);
  context.save();
  context.globalAlpha = alpha ?? 1;
  context.fillStyle = color;
  if (typeof context.roundRect === 'function') {
    context.beginPath();
    context.roundRect(px, py, s, s, radius);
    context.fill();
  } else {
    // fallback para motores sin soporte de roundRect
    context.fillRect(px, py, s, s);
  }
  context.fillStyle = 'rgba(255,255,255,0.35)';
  context.fillRect(px, py, s, 4);
  context.restore();
  context.globalAlpha = 1;
}

function skinsDrawBlockPixel(context, x, y, colorIndex, size, alpha) {
  if (!colorIndex) return;
  const color = SKINS.pixel.colors[colorIndex];
  const px = x * size + 1;
  const py = y * size + 1;
  const s = size - 2;
  context.save();
  context.globalAlpha = alpha ?? 1;
  context.fillStyle = color;
  context.fillRect(px, py, s, s);
  // textura tipo dithering/checker
  const cell = Math.max(2, Math.floor(size / 6));
  context.fillStyle = 'rgba(0,0,0,0.15)';
  for (let gy = 0; gy * cell < s; gy++) {
    for (let gx = 0; gx * cell < s; gx++) {
      if ((gx + gy) % 2 === 0) {
        const cx = px + gx * cell;
        const cy = py + gy * cell;
        const cw = Math.min(cell, px + s - cx);
        const ch = Math.min(cell, py + s - cy);
        context.fillRect(cx, cy, cw, ch);
      }
    }
  }
  context.fillStyle = 'rgba(255,255,255,0.18)';
  context.fillRect(px, py, s, 3);
  context.restore();
  context.globalAlpha = 1;
}

const SKINS = {
  retro: {
    colors: [
      null,
      '#4dd0e1', // I - cyan
      '#ffd54f', // O - yellow
      '#ba68c8', // T - purple
      '#81c784', // S - green
      '#e57373', // Z - red
      '#90caf9', // J - pale blue
      '#ffb74d', // L - orange
      '#bdbdbd', // Tuerca - gris metálico
    ],
    drawBlock: skinsDrawBlockRetro,
  },
  neon: {
    colors: [
      null,
      '#00e5ff', // I
      '#ffea00', // O
      '#e040fb', // T
      '#00e676', // S
      '#ff1744', // Z
      '#2979ff', // J
      '#ff9100', // L
      '#b0bec5', // Tuerca
    ],
    drawBlock: skinsDrawBlockNeon,
  },
  pastel: {
    colors: [
      null,
      '#a8dadc', // I
      '#ffe8a3', // O
      '#d8bbf0', // T
      '#b8e0c0', // S
      '#f4b8b8', // Z
      '#bcd4f0', // J
      '#f7cca0', // L
      '#d9d9d9', // Tuerca
    ],
    drawBlock: skinsDrawBlockPastel,
  },
  pixel: {
    colors: [
      null,
      '#26c6da', // I
      '#fdd835', // O
      '#ab47bc', // T
      '#66bb6a', // S
      '#ef5350', // Z
      '#42a5f5', // J
      '#ffa726', // L
      '#9e9e9e', // Tuerca
    ],
    drawBlock: skinsDrawBlockPixel,
  },
};
