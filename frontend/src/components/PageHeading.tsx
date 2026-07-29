import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useGSAP } from "@gsap/react";
import { pageHeadingAnimation } from "../animations/pageHeading";

type PageHeadingProps = {
  heading: string;
};

function PageHeading({ heading }: PageHeadingProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

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