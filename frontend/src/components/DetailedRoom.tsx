//imports

//react imports
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";

//types
import type { Rack, Ups, Pdu, Connection } from "../types";

//Helper functions
import { getRackData, getUpsData, getPduData, getConnectionsData } from "../services/api";
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

// Coordinates of one drawn cable, relative to the lines container
type LineCoordinates = {
    id: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
};

function DetailedRoom() {

    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const roomId = Number(id);

    const { roomsData } = useRooms();

    // For Service calls
    const [racksData, setRacksData] = useState<Rack[]>([]);
    const [upsData, setUpsData] = useState<Ups[]>([]);
    const [pduData, setPduData] = useState<Pdu[]>([]);
    const [connectionsData, setConnectionsData] = useState<Connection[]>([]);

    // For adding new rack, without explicitly choosing room ID
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    // For showing Cable Rearrange Overlay
    const [showCableOverlay, setShowCableOverlay] = useState(false);

    // Fetch racks, UPS, PDUs and connections
    useEffect(() => {
        getRackData()
            .then(setRacksData)
            .catch((err) => console.error("Rack API error", err));

        getUpsData()
            .then(setUpsData)
            .catch((err) => console.error("UPS API error", err));

        getPduData()
            .then(setPduData)
            .catch((err) => console.error("PDU API error", err));

        getConnectionsData()
            .then(setConnectionsData)
            .catch((err) => console.error("Connections API error", err));
    }, []);

    // Get current room
    const currentRoom = roomsData.find(room => room.ID === roomId);

    // Equipment and cables belonging to current room
    // (memoized, so the line calculation below only re-runs when data really changes)
    const roomRacks = useMemo(() => racksData.filter(rack => rack.RoomID === roomId), [racksData, roomId]);
    const roomUps = useMemo(() => upsData.filter(ups => ups.RoomID === roomId), [upsData, roomId]);
    const roomPdus = useMemo(() => pduData.filter(pdu => pdu.RoomID === roomId), [pduData, roomId]);
    const roomConnections = useMemo(
        () => connectionsData.filter(connection => connection.RoomID === roomId),
        [connectionsData, roomId]
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


    // Refs of every equipment icon (racks, UPS, PDUs), keyed by Equipment ID.
    // Rack/UPS/PDU IDs are Equipment IDs, so a connection's From/To ID points straight into this map
    const equipmentRefs = useRef<Map<number, HTMLElement>>(new Map());

    const setEquipmentRef = (equipmentId: number) => (el: HTMLElement | null) => {
        if (el) equipmentRefs.current.set(equipmentId, el);
        else equipmentRefs.current.delete(equipmentId);
    };

    // Parent of all equipment rows, the svg with the lines covers this whole div
    const linesContainerRef = useRef<HTMLDivElement | null>(null);

    const [lines, setLines] = useState<LineCoordinates[]>([]);

    // Calculate line coordinates from the real positions of the icons
    useLayoutEffect(() => {
        const container = linesContainerRef.current;
        if (!container) return;

        const calculateLines = () => {
            const box = container.getBoundingClientRect();

            const newLines: LineCoordinates[] = [];

            roomConnections.forEach(connection => {
                const from = equipmentRefs.current.get(connection.FromEquipmentID)?.getBoundingClientRect();
                const to = equipmentRefs.current.get(connection.ToEquipmentID)?.getBoundingClientRect();

                // Equipment not rendered (yet), skip that cable
                if (!from || !to) return;

                // Line goes from the edge of one icon to the facing edge of the other one
                const fromIsAbove = from.top + from.height / 2 <= to.top + to.height / 2;

                newLines.push({
                    id: connection.ID,
                    x1: from.left + from.width / 2 - box.left,
                    y1: (fromIsAbove ? from.bottom : from.top) - box.top,
                    x2: to.left + to.width / 2 - box.left,
                    y2: (fromIsAbove ? to.top : to.bottom) - box.top,
                    color: connection.Color,
                });
            });

            setLines(newLines);
        };

        calculateLines();

        // Recalculate when the layout changes (window resize, images finishing loading, rows wrapping)
        const resizeObserver = new ResizeObserver(calculateLines);
        resizeObserver.observe(container);
        window.addEventListener("resize", calculateLines);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", calculateLines);
        };
    }, [roomConnections, roomRacks, roomUps, roomPdus]);


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

                    {/* All equipment rows, lines are drawn on top of this container */}
                    <div ref={linesContainerRef} className="relative mt-6 flex flex-col gap-8">

                        {/* Cables from the DB, svg covers the whole container, clicks pass through it */}
                        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                            {lines.map(line => (
                                <ConnectionLine
                                    key={line.id}
                                    x1={line.x1}
                                    y1={line.y1}
                                    x2={line.x2}
                                    y2={line.y2}
                                    color={line.color}
                                    strokeWidth={3}
                                />
                            ))}
                        </svg>

                        {/* UPS devices - First row */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {roomUps.map(ups => (
                                <div key={ups.ID} className="relative group flex justify-center">
                                    <img
                                        ref={setEquipmentRef(ups.ID)}
                                        src={upsIcon}
                                        alt="UPS Icon"
                                        className="rack-item cursor-pointer max-w-[120px] transition-transform duration-150 hover:scale-110"
                                    />

                                    <UpsHoverOverlay ups={ups} t={t} />
                                </div>
                            ))}
                        </div>

                        {/* PDUs - Between UPS and racks, only shown when the room has some */}
                        {roomPdus.length > 0 && (
                            <div className="flex w-full items-center justify-between px-4">
                                {roomPdus.map(pdu => (
                                    <img
                                        key={pdu.ID}
                                        ref={setEquipmentRef(pdu.ID)}
                                        src={pduIcon}
                                        alt="PDU"
                                        className="rack-item"
                                    />
                                ))}
                            </div>
                        )}

                        {/* Racks and free places - last row */}
                        <div className="flex flex-wrap justify-center gap-4">

                            {/* Existing racks */}
                            {roomRacks.map(rack => (
                                <div key={rack.ID} className="relative group flex justify-center">
                                    <img
                                        ref={setEquipmentRef(rack.ID)}
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
            </div>
        </>
    );
}

export default DetailedRoom;
