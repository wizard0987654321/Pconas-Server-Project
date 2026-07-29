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
        stagger: 0.05,
        ease: "power2.out",
        clearProps: "all",
    });
};