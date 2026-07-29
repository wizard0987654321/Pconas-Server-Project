import gsap from "gsap";

export function animateHome() {
    gsap.from(".home-heading", {
        y: -80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
    });
}