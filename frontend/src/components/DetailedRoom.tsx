
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import PageHeading from "./PageHeading";
import { useState, useEffect, useRef } from "react";
import type { Rack, Ups } from "../types";
import { getRackData, getUpsData } from "../services/api";
import { useRooms } from "../helpers/hooks/roomOperations";
import serverIcon from "../assets/ServerIcon.svg";
import upsIcon from "../assets/upsIcon.svg";
import pduIcon from "../assets/PDU.svg";
import buttonIcon from "../assets/AddButton.svg";
import RackHoverOverlay from "./RackHoverOverlay";
import UpsHoverOverlay from "./UpsHoverOverlay";
import AddEquipmentOverlay from "./overlays/AddEquipmentOverlay";
import DisplayedRoomData from "./DisplayedRoomData";
import ConnectionLine from "./ConnectionLine";

function DetailedRoom() {

    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const { roomsData } = useRooms();

    const [racksData, setRacksData] = useState<Rack[]>([]);
    const [upsData, setUpsData] = useState<Ups[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

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

    // Get current room
    const currentRoom = roomsData.find(
        room => room.ID === Number(id)
    );

    // Get racks belonging to current room
    const roomRacks = racksData.filter(
        rack => rack.RoomID === Number(id)
    );

    // Get UPS devices belonging to current room
    const roomUps = upsData.filter(
        ups => ups.RoomID === Number(id)
    );

    // Navigate to rack details
    const handleRackClick = (rackId: number) => {
        navigate(`/racks/${rackId}`);
    };

    // Render free places
    const renderFreePlaces = () => {
        if (!currentRoom) return null;

        const occupiedPlaces = roomRacks.length + roomUps.length;
        const free = Math.max(0, currentRoom.Capacity - occupiedPlaces);

        return Array.from({ length: free }, (_, index) => (
            <img
                key={`free-${index}`}
                src={buttonIcon}
                alt="Add Equipment"
                onClick={() => setSelectedRoomId(currentRoom.ID)}
                className="rack-item cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95"
            />
        ));
    };

    //TESTTESTTEST

    const firstImageRef = useRef<HTMLImageElement | null>(null);
    const secondImageRef = useRef<HTMLImageElement | null>(null);
    const roomContainerRef = useRef<HTMLDivElement | null>(null);


    const [firstLineX, setFirstLineX] = useState(0);
    const [secondLineX, setSecondLineX] = useState(0);

    useEffect(() => {
        const calculateCoordinates = () => {
            const firstPDU = firstImageRef.current?.getBoundingClientRect();
            const secondPDU = secondImageRef.current?.getBoundingClientRect();
            const container = roomContainerRef.current?.getBoundingClientRect();

            if (!firstPDU || !secondPDU || !container) return;

            if (firstPDU) {
                setFirstLineX(firstPDU.x + firstPDU.width / 2 - container.left);
            }

            if (secondPDU) {
                setSecondLineX(300 - secondPDU.width / 2 - (container.right - secondPDU.right));
            }

            console.log("First PDU:", firstPDU)
            console.log("Second PDU", secondPDU)
            console.log("container:", container)
        };

        calculateCoordinates();

        window.addEventListener("resize", calculateCoordinates);

        return () => {
            window.removeEventListener("resize", calculateCoordinates);
        };
    }, []);

    //TESTETSTEST

    return (
        <>
            {selectedRoomId !== null && (
                <AddEquipmentOverlay
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


                <div className="my-15 flex w-full flex-col rounded-[0.5rem] border-[1rem] border-[#6ADBAF] p-6">

                    <DisplayedRoomData />

                    {/* UPS devices - First row */}
                    <div className="flex flex-wrap justify-center my-6 gap-4">

                        {roomUps.map(ups => (
                            <div key={ups.ID} className="relative group flex justify-center">

                                <img
                                    src={upsIcon}
                                    alt="UPS Icon"
                                    className="rack-item cursor-pointer max-w-[120px] transition-transform duration-150 hover:scale-110"
                                />

                                <UpsHoverOverlay ups={ups} t={t} />

                            </div>
                        ))}

                    </div>
                    {/* PDUs - Between UPS and racks */}
                    <div className="flex w-full items-center justify-between px-4">

                        <img
                            ref={firstImageRef}
                            src={pduIcon}
                            alt="PDU"
                            className="rack-item"
                        />

                        <img
                            ref={secondImageRef}
                            src={pduIcon}
                            alt="PDU"
                            className="rack-item"
                        />

                    </div>

                    {/* Two Test Lines */}
                    <div ref={roomContainerRef} className="flex justify-between">
                        <ConnectionLine
                            x1={firstLineX}
                            y1={0}
                            x2={90}
                            y2={150}
                            color="red"
                            strokeWidth={3}
                        />

                        <ConnectionLine
                            x1={secondLineX}
                            y1={0}
                            x2={250}
                            y2={150}
                            color="red"
                            strokeWidth={3}
                        />
                    </div>

                    {/* Racks and free places - third row */}
                    <div className="flex flex-wrap justify-center gap-4">

                        {/* Existing racks */}
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
            </div>
        </>
    );
}

export default DetailedRoom;