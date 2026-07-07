import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../App.css";
import { getHealth, getRoomData, getTestMessage } from "../services/api";
import { useNavigate } from "react-router-dom";
import PageHeading from "../components/PageHeading";

function Homepage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  return (
    <div className="p-4 flex flex-col items-center">
      <PageHeading heading="pages.home.helloText"/>
      <button onClick={() => navigate("/rooms")} className="animate-gradient-x w-[60%] xs:w-[50%] s:w-[40%] m:w-[30%] l:w-[20%] py-2 s:py-3 l:py-4 text-white font-mono font-bold text-base s:text-lg m:text-xl m-6 rounded-[16px] bg-gradient-to-r from-[#3FBC8B] via-[#6ADBAF] to-[#6ADBAF] hover:opacity-90 hover:cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
        {t("pages.home.button")}
      </button>
    </div>
  );
}

export default Homepage;
