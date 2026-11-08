//imports

//react imports
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

//types
import type { Rack, Ups } from "../types";

//Helper functions
import { getRackData, getUpsData } from "../services/api";
import { useRooms } from "../helpers/hooks/roomOperations";

//icons
import serverIcon from "../assets/ServerIcon.svg";
import upsIcon from "../assets/upsIcon.svg";
import pduIcon from "../assets/PDU.svg";
import buttonIcon from "../assets/AddButton.svg";

//components
import PageHeading from "./PageHeading";
import RackHoverOverlay from "./RackHoverOverlay";
import UpsHoverOverlay from "./UpsHoverOverlay";
import AddEquipmentOverlay from "./overlays/AddEquipmentOverlay";
import DisplayedRoomData from "./DisplayedRoomData";
import ConnectionLine from "./ConnectionLine";
import CableChangeOverlay from "./CableChangeOverlay";

function DetailedRoom() {

    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const { roomsData } = useRooms();

    // For Service calls
    const [racksData, setRacksData] = useState<Rack[]>([]);
    const [upsData, setUpsData] = useState<Ups[]>([]);

    // For adding new rack, without explicitly choosing room ID
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    // For showing Cable Rearrange Overlay
    const [showCableOverlay, setShowCableOverlay] = useState(false);

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


    // Get refs for first PDU, second PDU, ConnectionLines parent div
    const firstImageRef = useRef<HTMLImageElement | null>(null);
    const secondImageRef = useRef<HTMLImageElement | null>(null);
    const roomContainerRef = useRef<HTMLDivElement | null>(null);

    // Refs for all rack icons, keyed by rack ID
    const rackRefs = useRef<Map<number, HTMLImageElement>>(new Map());

    // Hardcoded for only two lines, gonna be adjusted later for data from db
    const [firstLineX, setFirstLineX] = useState(0);
    const [secondLineX, setSecondLineX] = useState(0);

    // Center X of every rack icon (relative to the line container),
    // same order as roomRacks
    const [rackCenters, setRackCenters] = useState<number[]>([]);

    const rack1CenterX = rackCenters[0] ?? 0;
    const rack2CenterX = rackCenters[1] ?? 0;

    // PDU coordinates
    useEffect(() => {
        const calculateCoordinates = () => {
            //Getting data about 3 refs, that were declared above
            const firstPDU = firstImageRef.current?.getBoundingClientRect();
            const secondPDU = secondImageRef.current?.getBoundingClientRect();
            const container = roomContainerRef.current?.getBoundingClientRect();

            if (!firstPDU || !secondPDU || !container) return;

            // Harrdcoded calculation of PDU Centers
            if (firstPDU) {
                setFirstLineX(firstPDU.x + firstPDU.width / 2 - container.left);
            }

            if (secondPDU) {
                setSecondLineX(secondPDU.x + secondPDU.width / 2 - container.left);
            }

            console.log("First PDU:", firstPDU)
            console.log("Second PDU", secondPDU)
            console.log("container:", container)
        };

        // Function call
        calculateCoordinates();

        // To reclaculate everything on screen resize
        window.addEventListener("resize", calculateCoordinates);

        return () => {
            window.removeEventListener("resize", calculateCoordinates);
        };
    }, []);

    // Rack coordinates (re-runs once racks have loaded)
    useEffect(() => {
        const calculateRackCenters = () => {
            const container = roomContainerRef.current?.getBoundingClientRect();
            if (!container) return;

            // Mapping through racks and calculating center for each
            const centers = roomRacks.map(rack => {
                const img = rackRefs.current.get(rack.ID);
                if (!img) return 0;

                const rect = img.getBoundingClientRect();
                const centerX = rect.x + rect.width / 2 - container.left;

                console.log(`Rack ${rack.ID}:`, rect);
                console.log(`Rack ${rack.ID} center X:`, centerX);

                return centerX;
            });

            setRackCenters(centers);
        };

        calculateRackCenters();

        window.addEventListener("resize", calculateRackCenters);

        return () => {
            window.removeEventListener("resize", calculateRackCenters);
        };
    }, [roomRacks.length]);


    return (
        <>
            {/* Two overlays, Adding Equipment with + Button and cable rearrange*/}
            {selectedRoomId !== null && (
                <AddEquipmentOverlay
                    onClose={() => setSelectedRoomId(null)}
                    roomId={selectedRoomId}
                />
            )}

            {showCableOverlay && (
                <CableChangeOverlay
                    onClose={() => setShowCableOverlay(false)}
                    heading={`${t("pages.rooms.cardHeading")} ${id}`}
                    roomRacks={roomRacks}
                    roomUps={roomUps}
                    freePlaces={Math.max(
                        0,
                        (currentRoom?.Capacity ?? 0) - roomRacks.length - roomUps.length
                    )}
                />
            )}

            {/* Heading and cable setup change button*/}
            <div className="flex min-h-screen w-full flex-col p-10">

                <div className="hidden max-m:flex min-h-screen items-center justify-center p-6 text-center">
                    <h1 className="text-2xl font-bold">
                        {t("pages.rooms.detailedView.smallScreen")}
                    </h1>
                </div>

                <PageHeading heading={`${t("pages.rooms.cardHeading")} ${id}`} />

                <button
                    onClick={() => setShowCableOverlay(true)}
                    className="mt-4 w-fit cursor-pointer rounded-[0.5rem] bg-[#6ADBAF] px-4 py-2 font-semibold"
                >
                    Rearrange cables, mere unda shevucvalo
                </button>


                <div className="my-15 flex w-full flex-col rounded-[0.5rem] border-[1rem] border-[#6ADBAF] p-6">

                    {/* Room Data - Temperature, Humidity, etc. */}
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
                    <div ref={roomContainerRef} className="w-full">
                        <svg className="h-[150px] w-full overflow-visible">
                            <ConnectionLine
                                x1={firstLineX}
                                y1={0}
                                x2={rack1CenterX}
                                y2={150}
                                color="red"
                                strokeWidth={3}
                            />

                            <ConnectionLine
                                x1={secondLineX}
                                y1={0}
                                x2={rack2CenterX}
                                y2={150}
                                color="red"
                                strokeWidth={3}
                            />
                        </svg>
                    </div>

                    {/* Racks and free places - third row */}
                    <div className="flex flex-wrap justify-center gap-4">

                        {/* Existing racks */}
                        {roomRacks.map(rack => (
                            <div key={rack.ID} className="relative group flex justify-center">

                                {/* Passing function as ref, in order to give every rack unique ref, only for server icons */}
                                <img
                                    ref={(el) => {
                                        if (el) rackRefs.current.set(rack.ID, el);
                                        else rackRefs.current.delete(rack.ID);
                                    }}
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