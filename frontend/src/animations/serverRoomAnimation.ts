/* ==========================================================================
 * BOOK THREAD A.14.3  serverRoomAnimation   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/animations/serverRoomAnimation.ts
 *
 * GSAP animation of the room view (2.2).
 *
 * ANIMATION - GSAP animation function, renders no HTML.
 *
 * Used by: 2.2 ServerRoom
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { gsap } from "gsap";

export const serverRoomAnimation = (container: HTMLElement) => {
  const items = container.querySelectorAll(".rack-item");

  if (items.length === 0) return;

  gsap.set(items, {
    opacity: 0,
    scale: 0,
  });

  gsap.to(items, {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    stagger: 0.1,
  });
};

// → Next in the book: A.14.4 dataListAnimation  (src/animations/dataListAnimation.ts)
