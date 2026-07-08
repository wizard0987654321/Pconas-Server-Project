import serverIcon from "../assets/ServerIcon.svg"
import PrimaryButton from "./PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getRoomData } from "../services/api";
import { useState, useEffect } from "react";

type Room = {
    ID: number,
    Area: number,
    Capacity: number,
    HeightCm: number
}

function ServerRoom() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [roomsData, setroomsData] = useState<Room[]>([]);

    //data[0].ID/Area/Capacity/HeightCm

    useEffect(() => {
        getRoomData()
            .then((data) => {
                console.log("API Response is sqlistvis:", data);
                setroomsData(data);
            })
            .catch((err) => {
                console.error("API erroria aee:", err);
            });
    }, []);

    return (
        <>
            {roomsData.map((room) => (
                <div key={room.ID} className="flex flex-col items-center p-4">
                    <h1>Room 1</h1>
                    <div className="flex flex-col items-center border-4 border-solid border-[#6ADBAF] rounded-[10px]">
                        <div
                            className="grid grid-rows-2"
                            style={{
                                gridTemplateColumns: `repeat(${Math.ceil(room.Capacity / 2)}, minmax(0, 1fr))`,
                            }}
                        >
                            <img src={serverIcon} alt="Server Icon" />
                        </div>
                        <PrimaryButton label={t("pages.rooms.button")} onClick={() => navigate("/racks")} />
                    </div>
                </div>
            ))}
        </>
    )
}

export default ServerRoom;