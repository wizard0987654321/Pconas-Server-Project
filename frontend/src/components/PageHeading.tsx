/* ==========================================================================
 * BOOK THREAD A.1  PageHeading   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/components/PageHeading.tsx
 *
 * Animated heading at the top of a page.
 *
 * Used by: 0.6.1 LoginScreen, 1 Homepage, 2 RoomsPage, 2.5 DetailedRoom, 3 RacksPage, 4 DeviceTypesPage,
 *   5 DevicesPage, 6 VmsPage, 7 ServicesPage, 8 CustomersPage
 * Uses: A.14.2 pageHeading
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useGSAP } from "@gsap/react";
import { pageHeadingAnimation } from "../animations/pageHeading"; // A.14.2 pageHeading

type PageHeadingProps = {
  heading: string;
};

//general page heading component

function PageHeading({ heading }: PageHeadingProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);


  //GSAP animation for general page heading component
  useGSAP(() => {
    if (containerRef.current) {
      pageHeadingAnimation(containerRef.current);
    }
  }, []);

  return (
    <div ref={containerRef} className="text-center">
      <div className="page-heading-box text-center inline-block m-2 px-2 py-3 s:py-4 m:py-5 l:py-6 border-[8px] s:border-[12px] m:border-[16px] l:border-[18px] border-solid border-[#6ADBAF] rounded-[16px]">
        <h1 className="page-heading-title font-mono font-bold text-center text-[#111827] dark:text-[#F9FAFB] text-3xl xs:text-4xl s:text-5xl m:text-6xl l:text-7xl">
          {t(heading)}
        </h1>
      </div>
    </div>
  );
}

export default PageHeading;

// → Next in the book: A.2 PrimaryButton  (src/components/buttons/PrimaryButton.tsx)
