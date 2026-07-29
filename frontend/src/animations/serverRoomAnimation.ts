import { gsap } from "gsap";

export const serverRoomAnimation = (container: HTMLElement) => {
  const items = container.querySelectorAll(".rack-item");
  
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