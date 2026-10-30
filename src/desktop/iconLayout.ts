import type { Point } from '../prefs/storage';
import type { Size } from '../wm/windowReducer';

export const ICON_W = 92;
export const ICON_H = 86;
const PAD = 14;
const SPACING = 6;

/** Automatic placement: columns from the top-left corner, like most desktops. */
export function defaultIconPosition(index: number, bounds: Size): Point {
  const perColumn = Math.max(1, Math.floor((bounds.h - PAD) / (ICON_H + SPACING)));
  return {
    x: PAD + Math.floor(index / perColumn) * (ICON_W + SPACING),
    y: PAD + (index % perColumn) * (ICON_H + SPACING),
  };
}

/** Keeps an icon fully inside the desktop. */
export function clampIcon(p: Point, bounds: Size): Point {
  return {
    x: Math.round(Math.min(Math.max(p.x, 0), Math.max(0, bounds.w - ICON_W))),
    y: Math.round(Math.min(Math.max(p.y, 0), Math.max(0, bounds.h - ICON_H))),
  };
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function boxFromPoints(a: Point, b: Point): Box {
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) };
}

export function iconIntersects(box: Box, p: Point): boolean {
  return box.x < p.x + ICON_W && box.x + box.w > p.x && box.y < p.y + ICON_H && box.y + box.h > p.y;
}
