import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import PageHeading from "./PageHeading";
import { useState, useEffect } from "react";
import type { Rack } from "../types";
import { getRackData } from "../services/api";
import { useRooms } from "../helpers/hooks/roomOperations";
import serverIcon from "../assets/ServerIcon.svg";
import buttonIcon from "../assets/AddButton.svg";
import RackHoverOverlay from "./RackHoverOverlay";
import AddRackOverlay from "./overlays/AddRackOverlay";

function DetailedRoom() {

    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const { roomsData } = useRooms();

    const [racksData, setRacksData] = useState<Rack[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    useEffect(() => {
        getRackData()
            .then((data) => {
                setRacksData(data);
            })
            .catch((err) => {
                console.error("API error", err);
            });
    }, []);

    // Get current room
    const currentRoom = roomsData.find(
        room => room.ID === Number(id)
    );

    // Get racks belonging to current room
    const roomRacks = racksData.filter(
        rack => rack.RoomID === Number(id)
    );

    // Navigate to rack details
    const handleRackClick = (rackId: number) => {
        navigate(`/racks/${rackId}`);
    };

    // Render free places
    const renderFreePlaces = () => {
        if (!currentRoom) return null;

        const free = Math.max(0, currentRoom.Capacity - roomRacks.length);

        return Array.from({ length: free }, (_, index) => (
            <img
                key={`free-${index}`}
                src={buttonIcon}
                alt="Add Rack"
                onClick={() => setSelectedRoomId(currentRoom.ID)}
                className="rack-item cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95"
            />
        ));
    };

    return (
        <>
            {selectedRoomId !== null && (
                <AddRackOverlay
                    onClose={() => setSelectedRoomId(null)}
                    roomId={selectedRoomId}
                />
            )}

            <div className="flex min-h-screen w-full flex-col p-10">

                <div className="hidden max-m:flex min-h-screen items-center justify-center p-6 text-center">
                    <h1 className="text-2xl font-bold">
                        {t("pages.rooms.detailedView.smallScreen")}
                    </h1>
                </div>

                <PageHeading heading={`${t("pages.rooms.cardHeading")} ${id}`} />

                <div className="my-15 flex w-full flex-wrap items-center justify-around gap-4 rounded-[0.5rem] border-[1rem] border-[#6ADBAF] p-6">

                    {/* Existing servers */}
                    {roomRacks.map(rack => (
                        <div key={rack.ID} className="relative group flex justify-center">

                            <img
                                src={serverIcon}
                                alt="Server Icon"
                                onClick={() => handleRackClick(rack.ID)}
                                className="rack-item cursor-pointer transition-transform duration-150 hover:scale-110"
                            />

                            <RackHoverOverlay rack={rack} t={t} />

                        </div>
                    ))}

                    {/* Empty places */}
                    {renderFreePlaces()}

                </div>
            </div>
        </>
    );
}

export default DetailedRoom;