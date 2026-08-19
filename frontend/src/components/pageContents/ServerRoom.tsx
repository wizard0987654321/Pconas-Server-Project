// ServerRoom.tsx

import serverIcon from "../../assets/ServerIcon.svg";
import buttonIcon from "../../assets/AddButton.svg";
import PrimaryButton from "../buttons/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getRackData } from "../../services/api";
import { useState, useEffect, useRef } from "react";
import type { Room, Rack } from "../../types";
import DeleteButton from "../buttons/DeleteButton";
import DeletingOverlay from "../overlays/generics/DeletingOverlay";
import { useRooms } from "../../helpers/hooks/roomOperations";
import AddRackOverlay from "../overlays/AddRackOverlay";
import { useGSAP } from "@gsap/react";
import { serverRoomAnimation } from "../../animations/serverRoomAnimation";

function ServerRoom() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { roomsData, deleteRoom } = useRooms();

    const [racksData, setRacksData] = useState<Rack[]>([]);
    const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    //gsap animation for racks in room visual view
    useGSAP(
        () => {
            if (containerRef.current) {
                serverRoomAnimation(containerRef.current);
            }
        },
        {
            scope: containerRef,
            dependencies: [roomsData, racksData],
        }
    );

    //path to rack detailed view
    const handleRackClick = (rackId: number) => {
        navigate(`/racks/${rackId}`);
    };

    useEffect(() => {
        getRackData()
            .then((data) => {
                setRacksData(data);
            })
            .catch((err) => {
                console.error("API error", err);
            });
    }, []);

    const handleAddButtonClick = (roomId: number) => {
        setSelectedRoomId(roomId);
    };

    //calculating with capacity and current rack number, how many places are occupied, displaying + buttons 
    const renderFreePlaces = (room: Room) => {
        const occupied = racksData.filter(rack => rack.RoomID === room.ID).length;
        const free = room.Capacity - occupied;

        const addButtonElements = [];

        for (let i = 0; i < free; i++) {
            addButtonElements.push(
                <img key={i} src={buttonIcon} alt="Add Rack" onClick={() => handleAddButtonClick(room.ID)} className="rack-item cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95" />
            );
        }

        return addButtonElements;
    };

    return (
        <>
            {roomToDelete !== null && (
                <DeletingOverlay
                    onCancel={() => setRoomToDelete(null)}
                    onConfirm={() => {
                        deleteRoom(roomToDelete);
                        setRoomToDelete(null);
                    }}
                />
            )}

            {selectedRoomId !== null && (
                <AddRackOverlay onClose={() => setSelectedRoomId(null)} roomId={selectedRoomId} />
            )}

            <div ref={containerRef} className="contents">
                {roomsData.map((room, index) => (
                    <div key={room.ID} className="flex flex-col items-center p-4">
                        <h1 className="font-mono font-bold text-xl xs:text-2xl s:text-3xl">
                            {t("pages.rooms.cardHeading")} {index + 1}
                        </h1>

                        <div className="flex flex-col items-center border-4 border-solid border-[#6ADBAF] rounded-[10px] bg-[#F8FAFC] text-[#111827] dark:bg-[#0F234F] dark:text-[#F9FAFB]">
                            <div className="grid grid-rows-2" style={{ gridTemplateColumns: `repeat(${Math.ceil(room.Capacity / 2)}, minmax(0, 1fr))` }}>
                                {racksData.map(rack => rack.RoomID === room.ID ? (
                                    <div key={rack.ID} className="relative group">
                                        <img
                                            src={serverIcon}
                                            alt="Server Icon"
                                            onClick={() => handleRackClick(rack.ID)}
                                            className="rack-item cursor-pointer transition-transform duration-150 hover:scale-110"
                                        />

                                        <div className="absolute font-mono left-1/2 top-full z-10 mt-2 hidden w-40 -translate-x-1/2 rounded-md border-3 border-[#6ADBAF] bg-[#F8FAFC] p-2 text-xs text-[#111827] shadow-lg group-hover:block dark:bg-[#0E1F48] dark:text-[#F9FAFB]">
                                            <p><span className="font-semibold">{t("common.rack")}:</span> {rack.RackNumber}</p>
                                            <p><span className="font-semibold">{t("common.units")}:</span> {rack.UnitsSize} U</p>
                                            <p><span className="font-semibold">{t("common.height")}:</span> {rack.HeightCm} cm</p>
                                        </div>
                                    </div>
                                ) : null)}

                                {renderFreePlaces(room)}
                            </div>

                            <PrimaryButton label={t("pages.rooms.button")} onClick={() => navigate(`/rooms/${room.ID}/racks`)} />

                            <DeleteButton label={t("pages.rooms.deleteButton")} onClick={() => setRoomToDelete(room.ID)} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default ServerRoom;