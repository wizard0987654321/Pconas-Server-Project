import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../App.css";
import { getHealth, getRoomData, getTestMessage } from "../services/api";
import { useNavigate } from "react-router-dom";
import PageHeading from "../components/PageHeading";
import PrimaryButton from "../components/buttons/PrimaryButton";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { animateHome } from "../animations/homepage";

function Homepage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getHealth()
      .then((data) => {
        console.log("API Response is aaeee:", data);
      })
      .catch((err) => {
        console.error("API erroria aee:", err);
      });
  }, []);

  useEffect(() => {
    getTestMessage()
      .then((data) => {
        console.log("API Response is testistvis:", data);
      })
      .catch((err) => {
        console.error("API erroria aee:", err);
      });
  }, []);

  useEffect(() => {
    getRoomData()
      .then((data) => {
        console.log("API Response is sqlistvis:", data);
      })
      .catch((err) => {
        console.error("API erroria aee:", err);
      });
  }, []);

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
