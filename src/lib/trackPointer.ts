import type { PointerEvent as ReactPointerEvent } from 'react';

export interface PointerTrackHandlers {
  /** Called at most once per animation frame with the offset from the start point. */
  onMove: (dx: number, dy: number, event: PointerEvent) => void;
  onEnd?: (dx: number, dy: number, cancelled: boolean) => void;
}

/**
 * Follows a pointer from a pointerdown until it is released. Listens on `window`
 * so fast movements never "lose" the element. Returns a cleanup function that
 * callers keep and run on unmount so no listener outlives its component.
 */
export function trackPointer(start: ReactPointerEvent, handlers: PointerTrackHandlers): () => void {
  const { pointerId, clientX: x0, clientY: y0 } = start;
  let frame = 0;
  let last: PointerEvent | null = null;
  let dx = 0;
  let dy = 0;

  const flush = () => {
    frame = 0;
    if (last) handlers.onMove(dx, dy, last);
  };

  const move = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return;
    dx = e.clientX - x0;
    dy = e.clientY - y0;
    last = e;
    if (!frame) frame = requestAnimationFrame(flush);
  };

  const finish = (cancelled: boolean) => (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return;
    cleanup();
    if (frame) flush();
    handlers.onEnd?.(dx, dy, cancelled);
  };
  const up = finish(false);
  const cancel = finish(true);

  function cleanup() {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', cancel);
  }

  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', cancel);
  return cleanup;
}
