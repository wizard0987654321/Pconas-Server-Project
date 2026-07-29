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