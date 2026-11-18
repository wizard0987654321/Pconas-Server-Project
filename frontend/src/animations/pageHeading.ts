/* ==========================================================================
 * BOOK THREAD A.14.2  pageHeading   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/animations/pageHeading.ts
 *
 * GSAP animation of the PageHeading (A.1).
 *
 * ANIMATION - GSAP animation function, renders no HTML.
 *
 * Used by: A.1 PageHeading
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { gsap } from "gsap";

export const pageHeadingAnimation = (container: HTMLElement) => {
  const q = gsap.utils.selector(container);

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  tl.from(q(".page-heading-box"), {
    scale: 0.8,
    opacity: 0,
    duration: 0.7,
    ease: "back.out(1.4)",
  }).from(
    q(".page-heading-title"),
    {
      y: 40,
      opacity: 0,
      duration: 0.8,
    },
    "-=0.4"
  );

  return tl;
};

// → Next in the book: A.14.3 serverRoomAnimation  (src/animations/serverRoomAnimation.ts)
