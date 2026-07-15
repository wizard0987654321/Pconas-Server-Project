import serverIcon from "../../assets/ServerIcon.svg"
import buttonIcon from "../../assets/AddButton.svg"
import PrimaryButton from "../buttons/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getRoomData, getRackData } from "../../services/api";
import { useState, useEffect } from "react";
import type { Room, Rack } from "../../types";


function ServerRoom() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [roomsData, setroomsData] = useState<Room[]>([]);
    const [racksData, setRacksData] = useState<Rack[]>([]);

    useEffect(() => {
        getRoomData()
            .then((data) => {
                console.log("API Response is sqlistvis roomdata:", data);
                setroomsData(data);
            })
            .catch((err) => {
                console.error("API error", err);
            });
    }, []);

    useEffect(() => {
        getRackData()
            .then((data) => {
                console.log("API Response is sqlistvis rackdata:", data);
                setRacksData(data);
            })
            .catch((err) => {
                console.error("API error", err);
            });
    }, []);

    const handleAddButtonClick = () => {
        console.log("addButton clicked");
    };


    //Free places button helper function
    const renderFreePlaces = (room: Room) => {
        //Count racks in this room
        const occupied = racksData.filter(
            (rack) => rack.RoomID === room.ID
        ).length;

        //Calculate free slots
        const free = room.Capacity - occupied;

        const addButtonElements = [];

        for (let i = 0; i < free; i++) {
            addButtonElements.push(
                <img key={i} src={buttonIcon} alt="Server Icon" onClick={handleAddButtonClick}
                    className="cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95" />
            );
        }

        return addButtonElements;
    };

    return (
        <>
            {roomsData.map((room) => (
                <div key={room.ID} className="flex flex-col items-center p-4">
                    <h1 className="font-mono font-bold text-xl xs:text-2xl s:text-3xl">{t("pages.rooms.cardHeading")} {room.ID}</h1>
                    <div className="flex flex-col items-center border-4 border-solid border-[#6ADBAF] rounded-[10px]">
                        <div
                            className="grid grid-rows-2"
                            style={{
                                gridTemplateColumns: `repeat(${Math.ceil(room.Capacity / 2)}, minmax(0, 1fr))`,
                            }}
                        >
                            {racksData.map((rack) => (
                                rack.RoomID == room.ID ? (
                                    <img key={rack.ID} src={serverIcon} alt="Server Icon" />
                                ) : null
                            ))}
                            {renderFreePlaces(room)}
                        </div>
                        <PrimaryButton label={t("pages.rooms.button")} onClick={() => navigate(`/rooms/${room.ID}/racks`)} />
                    </div>
                </div>
            ))}
        </>
    )
}

export default ServerRoom;