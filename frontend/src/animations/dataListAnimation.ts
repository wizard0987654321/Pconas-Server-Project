/* ==========================================================================
 * BOOK THREAD A.14.4  dataListAnimation   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/animations/dataListAnimation.ts
 *
 * GSAP animation of the DataList (A.6).
 *
 * ANIMATION - GSAP animation function, renders no HTML.
 *
 * Used by: A.6 DataList
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { gsap } from "gsap";

export const dataListAnimation = (container: HTMLElement) => {
    const rows = container.querySelectorAll(".data-list-row");

    if (!rows.length) return;

    gsap.set(rows, {
        opacity: 0,
        y: 15,
    });

    gsap.to(rows, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.15,
        ease: "power2.out",
        clearProps: "all",
    });
};

// → Next in the book: A.14.5 detailedRackAnimation  (src/animations/detailedRackAnimation.ts)
