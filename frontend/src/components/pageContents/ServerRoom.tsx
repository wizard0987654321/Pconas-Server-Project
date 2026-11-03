
import serverIcon from "../../assets/ServerIcon.svg";
import upsIcon from "../../assets/upsIcon.svg";
import buttonIcon from "../../assets/AddButton.svg";
import PrimaryButton from "../buttons/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getRackData, getUpsData } from "../../services/api";
import { useState, useEffect, useRef } from "react";
import type { Room, Rack, Ups } from "../../types";
import DeleteButton from "../buttons/DeleteButton";
import DeletingOverlay from "../overlays/generics/DeletingOverlay";
import { useRooms } from "../../helpers/hooks/roomOperations";
import AddRackOverlay from "../overlays/AddRackOverlay";
import { useGSAP } from "@gsap/react";
import { serverRoomAnimation } from "../../animations/serverRoomAnimation";
import RackHoverOverlay from "../RackHoverOverlay";
import UpsHoverOverlay from "../UpsHoverOverlay";

function ServerRoom() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { roomsData, deleteRoom } = useRooms();

    const [racksData, setRacksData] = useState<Rack[]>([]);
    const [upsData, setUpsData] = useState<Ups[]>([]);
    const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    // GSAP animation for equipment in room visual view
    useGSAP(
        () => {
            if (containerRef.current) {
                serverRoomAnimation(containerRef.current);
            }
        },
        {
            scope: containerRef,
            dependencies: [roomsData, racksData, upsData],
        }
    );

    // Path to rack detailed view
    const handleRackClick = (rackId: number) => {
        navigate(`/racks/${rackId}`);
    };

    // Fetch racks and UPS data
    useEffect(() => {
        getRackData()
            .then((data) => {
                setRacksData(data);
            })
            .catch((err) => {
                console.error("Rack API error", err);
            });

        getUpsData()
            .then((data) => {
                setUpsData(data);
            })
            .catch((err) => {
                console.error("UPS API error", err);
            });
    }, []);

    const handleAddButtonClick = (roomId: number) => {
        setSelectedRoomId(roomId);
    };

    // Calculate free places and display Add buttons
    const renderFreePlaces = (room: Room) => {
        const roomRacks = racksData.filter(rack => rack.RoomID === room.ID);
        const roomUps = upsData.filter(ups => ups.RoomID === room.ID);

        const occupied = roomRacks.length + roomUps.length;
        const free = Math.max(0, room.Capacity - occupied);

        const addButtonElements = [];

        for (let i = 0; i < free; i++) {
            addButtonElements.push(
                <img
                    key={`free-${i}`}
                    src={buttonIcon}
                    alt="Add Equipment"
                    onClick={() => handleAddButtonClick(room.ID)}
                    className="rack-item cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95"
                />
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
                <AddRackOverlay
                    onClose={() => setSelectedRoomId(null)}
                    roomId={selectedRoomId}
                />
            )}

            <div ref={containerRef} className="contents">
                {roomsData.map((room, index) => {

                    const roomRacks = racksData.filter(
                        rack => rack.RoomID === room.ID
                    );

                    const roomUps = upsData.filter(
                        ups => ups.RoomID === room.ID
                    );

                    return (
                        <div key={room.ID} className="flex flex-col items-center p-4">

                            <h1 className="font-mono font-bold text-xl xs:text-2xl s:text-3xl">
                                {t("pages.rooms.cardHeading")} {index + 1}
                            </h1>

                            <div className="flex flex-col items-center border-4 border-solid border-[#6ADBAF] rounded-[10px] bg-[#F8FAFC] text-[#111827] dark:bg-[#0F234F] dark:text-[#F9FAFB]">

                                <div
                                    className="grid grid-rows-2"
                                    style={{
                                        gridTemplateColumns: `repeat(${Math.ceil(room.Capacity / 2)}, minmax(0, 1fr))`
                                    }}
                                >

                                    {/* Existing racks */}
                                    {roomRacks.map(rack => (
                                        <div key={`rack-${rack.ID}`} className="relative group">

                                            <img
                                                src={serverIcon}
                                                alt="Server Icon"
                                                onClick={() => handleRackClick(rack.ID)}
                                                className="rack-item cursor-pointer transition-transform duration-150 hover:scale-110"
                                            />

                                            <RackHoverOverlay rack={rack} t={t} />

                                        </div>
                                    ))}

                                    {/* Existing UPS devices */}
                                    {roomUps.map(ups => (
                                        <div key={`ups-${ups.ID}`} className="relative group">

                                            <img
                                                src={upsIcon}
                                                alt="UPS Icon"
                                                className="rack-item max-w-[120px] cursor-pointer transition-transform duration-150 hover:scale-110"
                                            />

                                            <UpsHoverOverlay ups={ups} t={t} />

                                        </div>
                                    ))}

                                    {/* Empty places */}
                                    {renderFreePlaces(room)}

                                </div>

                                <PrimaryButton
                                    label={t("pages.rooms.button")}
                                    onClick={() => navigate(`/rooms/${room.ID}/racks`)}
                                />

                                <PrimaryButton
                                    label={t("pages.rooms.detailedButton")}
                                    onClick={() => navigate(`/rooms/${room.ID}`)}
                                />

                                <DeleteButton
                                    label={t("pages.rooms.deleteButton")}
                                    onClick={() => setRoomToDelete(room.ID)}
                                />

                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default ServerRoom;
