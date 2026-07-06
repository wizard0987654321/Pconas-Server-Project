import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../App.css";
import { getHealth, getRoomData, getTestMessage } from "../services/api";
import { useNavigate } from "react-router-dom";

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
      <div className="w-[95%] xs:w-[90%] s:w-[80%] m:w-[70%] l:w-[60%] py-3 s:py-4 m:py-5 l:py-6 border-[8px] s:border-[12px] m:border-[16px] l:border-[18px] border-solid border-[#6ADBAF] rounded-[16px]">
        <h1 className="font-mono font-bold text-center text-black dark:text-red-600 text-3xl xs:text-4xl s:text-5xl m:text-6xl l:text-7xl">
          {t("pages.home.helloText")}
        </h1>
      </div>
      <button onClick={() => navigate("/rooms")} className="animate-gradient-x w-[60%] xs:w-[50%] s:w-[40%] m:w-[30%] l:w-[20%] py-2 s:py-3 l:py-4 text-white font-mono font-bold text-base s:text-lg m:text-xl m-6 rounded-[16px] bg-gradient-to-r from-[#3FBC8B] via-[#6ADBAF] to-[#6ADBAF] hover:opacity-90 hover:cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
        {t("pages.home.button")}
      </button>
    </div>
  );
}

export default Homepage;
