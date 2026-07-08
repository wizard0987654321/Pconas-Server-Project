import serverIcon from "../assets/ServerIcon.svg"
import PrimaryButton from "./PrimaryButton";
import { useNavigate } from "react-router-dom"; 
import { useTranslation } from "react-i18next";

function ServerRoom() {
    const navigate = useNavigate();
    const { t } = useTranslation();


    return (
        <>
            <h1>Room 1</h1>
            <div className="flex flex-col items-center border-4 border-solid border-[#6ADBAF] rounded-[10px]">
                <div className="grid grid-cols-2 grid-rows-2">
                    <img
                        src={serverIcon}
                        className=""
                        alt="Server Icon"
                    />
                </div>
                <PrimaryButton label={t("pages.rooms.button")} onClick={() => navigate("/racks")} />
            </div>
        </>
    )
}

export default ServerRoom;