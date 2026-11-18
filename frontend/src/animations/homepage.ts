/* ==========================================================================
 * BOOK THREAD A.14.1  homepage   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/animations/homepage.ts
 *
 * GSAP animation of the Homepage (1).
 *
 * ANIMATION - GSAP animation function, renders no HTML.
 *
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import gsap from "gsap";

export function animateHome() {
    gsap.from(".home-heading", {
        y: -80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
    });
}

// → Next in the book: A.14.2 pageHeading  (src/animations/pageHeading.ts)
