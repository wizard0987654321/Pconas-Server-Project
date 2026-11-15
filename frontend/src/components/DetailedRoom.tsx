//imports

//react imports
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";

//types
import type { Rack, Ups, Pdu, Connection, Fault, PowerSource as PowerSourceData } from "../types";

//Helper functions
import { getRackData, getUpsData, getPduData, getPowerSourceData, getConnectionsData, getFaultsData } from "../services/api";
import { useRooms } from "../helpers/hooks/roomOperations";
import { useAuth } from "../contexts/AuthProvider";
import { useEquipmentRefs, useConnectionLines, type LineInput } from "../helpers/hooks/connectionLines";
import { usePowerFlow } from "../helpers/hooks/usePowerFlow";
import { isPowerCable } from "../helpers/powerFlow";

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
import PowerSource from "./simulation/PowerSource";
import PowerLegend from "./simulation/PowerLegend";
import DamagedMark from "./simulation/DamagedMark";
import TrainerPanel, { type TrainerTarget } from "./simulation/TrainerPanel";
import { POWER_STATE_ICON_CLASS, DAMAGED_COLOR } from "./simulation/powerStyles";

function DetailedRoom() {

    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const roomId = Number(id);

    const { roomsData } = useRooms();
    const { isTrainer } = useAuth();

    // For Service calls
    const [racksData, setRacksData] = useState<Rack[]>([]);
    const [upsData, setUpsData] = useState<Ups[]>([]);
    const [pduData, setPduData] = useState<Pdu[]>([]);
    const [powerSourceData, setPowerSourceData] = useState<PowerSourceData[]>([]);
    const [connectionsData, setConnectionsData] = useState<Connection[]>([]);
    const [faultsData, setFaultsData] = useState<Fault[]>([]);

    // For adding new rack, without explicitly choosing room ID
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    // For showing Cable Rearrange Overlay
    const [showCableOverlay, setShowCableOverlay] = useState(false);

    // Fetch racks, UPS, PDUs, power sources and connections
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

        getPowerSourceData()
            .then(setPowerSourceData)
            .catch((err) => console.error("Power source API error", err));

        reloadFaults();
        reloadConnections();
    }, []);

    // Also called by the trainer panel after damaging / repairing
    const reloadFaults = () =>
        getFaultsData()
            .then(setFaultsData)
            .catch((err) => console.error("Faults API error", err));

    // Also called by the cable overlay after saving new cables
    const reloadConnections = () =>
        getConnectionsData()
            .then(setConnectionsData)
            .catch((err) => console.error("Connections API error", err));

    // Get current room object with parameters
    const currentRoom = roomsData.find(room => room.ID === roomId);

    // Equipment and cables belonging to current room, filtering with current room id
    // (memoized, so the line and power calculations below only re-run when data really changes)
    const roomRacks = useMemo(() => racksData.filter(rack => rack.RoomID === roomId), [racksData, roomId]);
    const roomUps = useMemo(() => upsData.filter(ups => ups.RoomID === roomId), [upsData, roomId]);
    const roomPdus = useMemo(() => pduData.filter(pdu => pdu.RoomID === roomId), [pduData, roomId]);
    const roomConnections = useMemo(() => connectionsData.filter(connection => connection.RoomID === roomId), [connectionsData, roomId]);
    const roomPowerSource = useMemo(() => powerSourceData.find(source => source.RoomID === roomId) ?? null, [powerSourceData, roomId]);
    const roomFaults = useMemo(() => faultsData.filter(fault => fault.RoomID === roomId), [faultsData, roomId]);

    // Which equipment has power, which cables are dead, and what is damaged
    const { deadCableIds, powerStateOf, faultOfEquipment, faultOfCable } = usePowerFlow({
        powerSource: roomPowerSource,
        ups: roomUps,
        pdus: roomPdus,
        racks: roomRacks,
        connections: roomConnections,
        faults: roomFaults,
    });
    const isDamaged = (equipmentId: number) => faultOfEquipment(equipmentId) === "damaged";
    const powerClass = (equipmentId: number) => POWER_STATE_ICON_CLASS[powerStateOf(equipmentId)];

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


    // Refs of every equipment icon (power source, racks, UPS, PDUs), keyed by Equipment ID.
    // All of them are Equipment IDs, so a connection's From/To ID points straight into this map
    const { equipmentRefs, setEquipmentRef } = useEquipmentRefs();

    // Parent of the power source and the room, the svg with the lines covers this whole div
    const linesContainerRef = useRef<HTMLDivElement | null>(null);

    // Power cables without power are drawn dashed, damaged cables red + dashed with an X
    const lineInputs = useMemo<LineInput[]>(
        () => roomConnections.map(connection => {
            const damaged = faultOfCable(connection.ID) === "damaged";

            return {
                key: String(connection.ID),
                fromId: connection.FromEquipmentID,
                toId: connection.ToEquipmentID,
                color: damaged ? DAMAGED_COLOR : connection.Color,
                dashed: damaged || deadCableIds.has(connection.ID),
                damaged,
            };
        }),
        [roomConnections, deadCableIds, faultOfCable]
    );

    // Line coordinates calculated from the real positions of the icons
    const lines = useConnectionLines(linesContainerRef, equipmentRefs, lineInputs, [roomPowerSource, roomRacks, roomUps, roomPdus]);

    // Currently hovered cable (line key = connection ID)
    const [hoveredLineKey, setHoveredLineKey] = useState<string | null>(null);

    // Equipment ID -> readable name ("Power grid", "Rack 3", "UPS 1", "PDU 2"), used in the cable hover div
    const equipmentLabels = useMemo(() => {
        const labels = new Map<number, string>();
        if (roomPowerSource) labels.set(roomPowerSource.ID, t("pages.rooms.detailedView.power.grid"));
        roomRacks.forEach(rack => labels.set(rack.ID, `${t("common.rack")} ${rack.RackNumber}`));
        roomUps.forEach(ups => labels.set(ups.ID, `${t("common.ups")} ${ups.UPSNumber}`));
        roomPdus.forEach(pdu => labels.set(pdu.ID, `${t("common.pdu")} ${pdu.PDUNumber}`));
        return labels;
    }, [roomPowerSource, roomRacks, roomUps, roomPdus, t]);

    const hoveredLine = lines.find(line => line.key === hoveredLineKey);
    const hoveredConnection = roomConnections.find(connection => String(connection.ID) === hoveredLineKey);

    // Trainer selection: while select mode is on, a click selects the equipment / cable
    // (instead of its normal action, e.g. opening the rack)
    const [selectMode, setSelectMode] = useState(false);
    const [selectedTarget, setSelectedTarget] = useState<TrainerTarget | null>(null);

    const handleSelectModeChange = (on: boolean) => {
        setSelectMode(on);
        setSelectedTarget(null);
    };

    const equipmentLabel = (equipmentId: number) => equipmentLabels.get(equipmentId) ?? t("common.unknown");

    const selectCable = (connectionId: number) => {
        const connection = roomConnections.find(c => c.ID === connectionId);
        if (!connection) return;
        setSelectedTarget({
            kind: "cable",
            id: connectionId,
            label: `${equipmentLabel(connection.FromEquipmentID)} → ${equipmentLabel(connection.ToEquipmentID)}`,
        });
    };

    // Click on an equipment icon: select it in select mode, otherwise its normal action (if any)
    const handleEquipmentClick = (equipmentId: number, normalAction?: () => void) => () => {
        if (selectMode) setSelectedTarget({ kind: "equipment", id: equipmentId, label: equipmentLabel(equipmentId) });
        else normalAction?.();
    };

    const isSelected = (kind: TrainerTarget["kind"], targetId: number) =>
        selectMode && selectedTarget?.kind === kind && selectedTarget.id === targetId;

    const selectionClass = (equipmentId: number) => isSelected("equipment", equipmentId) ? "rounded-lg ring-4 ring-[#DC2626]" : "";


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
                    roomPowerSource={roomPowerSource}
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

                {isTrainer && (
                    <div className="mt-4">
                        <TrainerPanel
                            roomId={roomId}
                            roomFaults={roomFaults}
                            selectMode={selectMode}
                            onSelectModeChange={handleSelectModeChange}
                            selected={selectedTarget}
                            onChanged={reloadFaults}
                            t={t}
                        />
                    </div>
                )}


                <div className="my-15 flex w-full flex-col gap-6">

                    {/* Room Data - Temperature, Humidity, etc. */}
                    <DisplayedRoomData />

                    <PowerLegend t={t} />

                    {/* Power source (outside) and the room (green border), lines are drawn on top of this container,
                        so the cable from the power source visibly enters the room through its wall */}
                    <div ref={linesContainerRef} className="relative flex flex-col">

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
                                    dashed={line.dashed}
                                    damaged={line.damaged}
                                    hovered={line.key === hoveredLineKey || isSelected("cable", Number(line.key))}
                                    onMouseEnter={() => setHoveredLineKey(line.key)}
                                    onMouseLeave={() => setHoveredLineKey(null)}
                                    onClick={selectMode ? () => selectCable(Number(line.key)) : undefined}
                                />
                            ))}
                        </svg>

                        {/* Info div of the hovered cable, shown at the middle of the line */}
                        {hoveredLine && hoveredConnection && (
                            <ConnectionHoverOverlay
                                connection={hoveredConnection}
                                dead={isPowerCable(hoveredConnection) ? deadCableIds.has(hoveredConnection.ID) : undefined}
                                faultType={faultOfCable(hoveredConnection.ID)}
                                fromLabel={equipmentLabels.get(hoveredConnection.FromEquipmentID) ?? t("common.unknown")}
                                toLabel={equipmentLabels.get(hoveredConnection.ToEquipmentID) ?? t("common.unknown")}
                                language={i18n.language}
                                x={(hoveredLine.x1 + hoveredLine.x2) / 2}
                                y={(hoveredLine.y1 + hoveredLine.y2) / 2}
                                t={t}
                            />
                        )}

                        {/* Rows don't catch the mouse (only their items do), so lines behind the empty row space stay hoverable */}

                        {/* Fixed outer power source - above (outside) the room */}
                        {roomPowerSource && (
                            <div className="pointer-events-none mb-12 flex justify-center">
                                <PowerSource
                                    state={powerStateOf(roomPowerSource.ID)}
                                    faultType={faultOfEquipment(roomPowerSource.ID)}
                                    iconRef={setEquipmentRef(roomPowerSource.ID)}
                                    iconClassName={selectionClass(roomPowerSource.ID)}
                                    onClick={handleEquipmentClick(roomPowerSource.ID)}
                                    t={t}
                                />
                            </div>
                        )}

                        {/* The room itself */}
                        <div className="pointer-events-none flex w-full flex-col gap-8 rounded-[0.5rem] border-[1rem] border-[#6ADBAF] p-6">

                            {/* UPS devices - First row */}
                            <div className="pointer-events-none flex flex-wrap justify-center gap-4">
                                {roomUps.map(ups => (
                                    <div key={ups.ID} className="pointer-events-auto relative group flex justify-center">
                                        <img
                                            ref={setEquipmentRef(ups.ID)}
                                            src={upsIcon}
                                            alt="UPS Icon"
                                            onClick={handleEquipmentClick(ups.ID)}
                                            className={`rack-item cursor-pointer max-w-[120px] transition-transform duration-150 hover:scale-110 ${powerClass(ups.ID)} ${selectionClass(ups.ID)}`}
                                        />

                                        {isDamaged(ups.ID) && <DamagedMark />}

                                        <UpsHoverOverlay ups={ups} powerState={powerStateOf(ups.ID)} faultType={faultOfEquipment(ups.ID)} t={t} />
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
                                                onClick={handleEquipmentClick(pdu.ID)}
                                                className={`rack-item cursor-pointer transition-transform duration-150 hover:scale-110 ${powerClass(pdu.ID)} ${selectionClass(pdu.ID)}`}
                                            />

                                            {isDamaged(pdu.ID) && <DamagedMark />}

                                            <PduHoverOverlay pdu={pdu} powerState={powerStateOf(pdu.ID)} faultType={faultOfEquipment(pdu.ID)} t={t} />
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
                                            onClick={handleEquipmentClick(rack.ID, () => handleRackClick(rack.ID))}
                                            className={`rack-item cursor-pointer transition-transform duration-150 hover:scale-110 ${powerClass(rack.ID)} ${selectionClass(rack.ID)}`}
                                        />

                                        {isDamaged(rack.ID) && <DamagedMark />}

                                        <RackHoverOverlay rack={rack} powerState={powerStateOf(rack.ID)} faultType={faultOfEquipment(rack.ID)} t={t} />
                                    </div>
                                ))}

                                {/* Empty places */}
                                {renderFreePlaces()}

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}

export default DetailedRoom;
