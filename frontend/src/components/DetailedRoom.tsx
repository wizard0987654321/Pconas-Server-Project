//imports

//react imports
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";

//types
import type { Rack, Ups, Pdu, Connection } from "../types";

//Helper functions
import { getRackData, getUpsData, getPduData, getConnectionsData } from "../services/api";
import { useRooms } from "../helpers/hooks/roomOperations";
import { useEquipmentRefs, useConnectionLines, type LineInput } from "../helpers/hooks/connectionLines";

//icons
import serverIcon from "../assets/ServerIcon.svg";
import upsIcon from "../assets/upsIcon.svg";
import pduIcon from "../assets/PDU.svg";
import buttonIcon from "../assets/AddButton.svg";

//components
import PageHeading from "./PageHeading";
import RackHoverOverlay from "./RackHoverOverlay";
import UpsHoverOverlay from "./UpsHoverOverlay";
import PduHoverOverlay from "./PduHoverOverlay";
import ConnectionHoverOverlay from "./ConnectionHoverOverlay";
import AddEquipmentOverlay from "./overlays/AddEquipmentOverlay";
import DisplayedRoomData from "./DisplayedRoomData";
import ConnectionLine from "./ConnectionLine";
import CableChangeOverlay from "./CableChangeOverlay";

function DetailedRoom() {

    const { t, i18n } = useTranslation();
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

        reloadConnections();
    }, []);

    // Also called by the cable overlay after saving new cables
    const reloadConnections = () =>
        getConnectionsData()
            .then(setConnectionsData)
            .catch((err) => console.error("Connections API error", err));

    // Get current room object with parameters
    const currentRoom = roomsData.find(room => room.ID === roomId);

    // Equipment and cables belonging to current room, filtering with current room id
    // (memoized, so the line calculation below only re-runs when data really changes)
    const roomRacks = useMemo(() => racksData.filter(rack => rack.RoomID === roomId), [racksData, roomId]);
    const roomUps = useMemo(() => upsData.filter(ups => ups.RoomID === roomId), [upsData, roomId]);
    const roomPdus = useMemo(() => pduData.filter(pdu => pdu.RoomID === roomId), [pduData, roomId]);
    const roomConnections = useMemo(() => connectionsData.filter(connection => connection.RoomID === roomId), [connectionsData, roomId]);

    // Equipment IDs that have at least one cable (as From or To), others are shown half transparent
    // flatMap for saving all values as one single array and Set for deleting duplicates
    const connectedIds = useMemo(
        () => new Set(roomConnections.flatMap(c => [c.FromEquipmentID, c.ToEquipmentID])),
        [roomConnections]
    );
    const opacityClass = (equipmentId: number) => connectedIds.has(equipmentId) ? "" : "opacity-50";

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
                className="pointer-events-auto rack-item cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95"
            />
        ));
    };


    // Refs of every equipment icon (racks, UPS, PDUs), keyed by Equipment ID.
    // Rack/UPS/PDU IDs are Equipment IDs, so a connection's From/To ID points straight into this map
    const { equipmentRefs, setEquipmentRef } = useEquipmentRefs();

    // Parent of all equipment rows, the svg with the lines covers this whole div
    const linesContainerRef = useRef<HTMLDivElement | null>(null);

    const lineInputs = useMemo<LineInput[]>(
        () => roomConnections.map(connection => ({
            key: String(connection.ID),
            fromId: connection.FromEquipmentID,
            toId: connection.ToEquipmentID,
            color: connection.Color,
        })),
        [roomConnections]
    );

    // Line coordinates calculated from the real positions of the icons
    const lines = useConnectionLines(linesContainerRef, equipmentRefs, lineInputs, [roomRacks, roomUps, roomPdus]);

    // Currently hovered cable (line key = connection ID)
    const [hoveredLineKey, setHoveredLineKey] = useState<string | null>(null);

    // Equipment ID -> readable name ("Rack 3", "UPS 1", "PDU 2"), used in the cable hover div
    const equipmentLabels = useMemo(() => {
        const labels = new Map<number, string>();
        roomRacks.forEach(rack => labels.set(rack.ID, `${t("common.rack")} ${rack.RackNumber}`));
        roomUps.forEach(ups => labels.set(ups.ID, `${t("common.ups")} ${ups.UPSNumber}`));
        roomPdus.forEach(pdu => labels.set(pdu.ID, `${t("common.pdu")} ${pdu.PDUNumber}`));
        return labels;
    }, [roomRacks, roomUps, roomPdus, t]);

    const hoveredLine = lines.find(line => line.key === hoveredLineKey);
    const hoveredConnection = roomConnections.find(connection => String(connection.ID) === hoveredLineKey);


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
                    onSaved={reloadConnections}
                    heading={`${t("pages.rooms.cardHeading")} ${id}`}
                    roomRacks={roomRacks}
                    roomUps={roomUps}
                    roomPdus={roomPdus}
                    roomConnections={roomConnections}
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
                    {t("pages.rooms.detailedView.cables.openButton")}
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
                                    key={line.key}
                                    x1={line.x1}
                                    y1={line.y1}
                                    x2={line.x2}
                                    y2={line.y2}
                                    color={line.color}
                                    strokeWidth={3}
                                    hovered={line.key === hoveredLineKey}
                                    onMouseEnter={() => setHoveredLineKey(line.key)}
                                    onMouseLeave={() => setHoveredLineKey(null)}
                                />
                            ))}
                        </svg>

                        {/* Info div of the hovered cable, shown at the middle of the line */}
                        {hoveredLine && hoveredConnection && (
                            <ConnectionHoverOverlay
                                connection={hoveredConnection}
                                fromLabel={equipmentLabels.get(hoveredConnection.FromEquipmentID) ?? t("common.unknown")}
                                toLabel={equipmentLabels.get(hoveredConnection.ToEquipmentID) ?? t("common.unknown")}
                                language={i18n.language}
                                x={(hoveredLine.x1 + hoveredLine.x2) / 2}
                                y={(hoveredLine.y1 + hoveredLine.y2) / 2}
                                t={t}
                            />
                        )}

                        {/* Rows don't catch the mouse (only their items do), so lines behind the empty row space stay hoverable */}

                        {/* UPS devices - First row */}
                        <div className="pointer-events-none flex flex-wrap justify-center gap-4">
                            {roomUps.map(ups => (
                                <div key={ups.ID} className="pointer-events-auto relative group flex justify-center">
                                    <img
                                        ref={setEquipmentRef(ups.ID)}
                                        src={upsIcon}
                                        alt="UPS Icon"
                                        className={`rack-item cursor-pointer max-w-[120px] transition-transform duration-150 hover:scale-110 ${opacityClass(ups.ID)}`}
                                    />

                                    <UpsHoverOverlay ups={ups} t={t} />
                                </div>
                            ))}
                        </div>

                        {/* PDUs - Between UPS and racks, only shown when the room has some */}
                        {roomPdus.length > 0 && (
                            <div className="pointer-events-none flex w-full items-center justify-between px-4">
                                {roomPdus.map(pdu => (
                                    <div key={pdu.ID} className="pointer-events-auto relative group flex justify-center">
                                        <img
                                            ref={setEquipmentRef(pdu.ID)}
                                            src={pduIcon}
                                            alt="PDU"
                                            className={`rack-item cursor-pointer transition-transform duration-150 hover:scale-110 ${opacityClass(pdu.ID)}`}
                                        />

                                        <PduHoverOverlay pdu={pdu} t={t} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Racks and free places - last row */}
                        <div className="pointer-events-none flex flex-wrap justify-center gap-4">

                            {/* Existing racks */}
                            {roomRacks.map(rack => (
                                <div key={rack.ID} className="pointer-events-auto relative group flex justify-center">
                                    <img
                                        ref={setEquipmentRef(rack.ID)}
                                        src={serverIcon}
                                        alt="Server Icon"
                                        onClick={() => handleRackClick(rack.ID)}
                                        className={`rack-item cursor-pointer transition-transform duration-150 hover:scale-110 ${opacityClass(rack.ID)}`}
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
