import { gsap } from "gsap";

export const detailedRackAnimation = (container: HTMLElement) => {
    const rows = container.querySelectorAll(".rack-unit-row");

    if (!rows.length) return;

    gsap.fromTo(
        rows,
        {
            opacity: 0,
            x: -30,
        },
        {
            opacity: 1,
            x: 0,
            duration: 0.35,
            stagger: 0.04,
            ease: "power2.out",
            clearProps: "transform",
        }
    );
};