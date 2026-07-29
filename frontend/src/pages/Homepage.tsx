import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import PageHeading from "../components/PageHeading";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { useGSAP } from "@gsap/react";
import { animateHome } from "../animations/homepage";

function Homepage() {
  const navigate = useNavigate();
  const { t } = useTranslation();


  const container = useRef<HTMLDivElement>(null);
//using gsap animation, animation in src/animations folder
  useGSAP(() => {
    animateHome();
  }, { scope: container });

  return (
    <div ref={container} className="p-4 flex flex-col items-center">
      <div className="home-heading">
        <PageHeading heading="pages.home.helloText" />
      </div>
      <PrimaryButton label={t("pages.home.button")} onClick={() => navigate("/rooms")} />
    </div>
  );
}

export default Homepage;
