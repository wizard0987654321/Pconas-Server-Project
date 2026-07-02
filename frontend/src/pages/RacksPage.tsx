import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function RacksPage() {
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        gsap.to(titleRef.current, {
        x: 300,
        duration: 2,
        ease: "power1.inOut",
    });
    }, []);

    return (
        <div>
            <h1 ref={titleRef}>This is Racks Page</h1>
        </div>
    );
}

export default RacksPage;