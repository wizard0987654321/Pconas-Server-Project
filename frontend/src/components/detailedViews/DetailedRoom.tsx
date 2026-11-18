/* ==========================================================================
 * BOOK THREAD 2.5  DetailedRoom   (Chapter 2: Rooms)
 * File: src/components/detailedViews/DetailedRoom.tsx
 *
 * Detailed virtual room: power grid with generators / fans, cabinet UPS, PDUs, racks, the cables between
 * them, trainer faults and the room climate. Hooks 2.5.1 - 2.5.6 prepare the data, components 2.5.8 - 2.5.17
 * draw it.
 *
 * Reached via: URL /rooms/:id  (button "Open detailed virtual Room View" in 2.1 ServerRoomList and 2.2 ServerRoom)
 * Used by: 0.5 routes
 * Uses: 0.3 AuthProvider, 2.2.2 RackHoverCard, 2.2.3 UpsHoverCard, 2.5.1 useRoomData, 2.5.2 usePowerFlow,
 *   2.5.2.1 powerFlow, 2.5.3 roomClimate, 2.5.3.1 inRackUps, 2.5.4 connectionLines,
 *   2.5.5 useEquipmentLabels, 2.5.6 useTrainerSelection, 2.5.7 powerStyles, 2.5.8 PowerSource,
 *   2.5.8.3 DamagedMark, 2.5.9 AddEquipmentOverlay, 2.5.10 AddOutsideEquipmentOverlay,
 *   2.5.11 OutsideEquipmentInfoOverlay, 2.5.12 CableChangeOverlay, 2.5.12.1 ConnectionLine,
 *   2.5.13 TrainerPanel, 2.5.14 DisplayedRoomData, 2.5.15 PowerLegend, 2.5.16 ConnectionHoverCard,
 *   2.5.17 PduHoverCard, A.1 PageHeading, A.10.1 roomOperations, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

//imports

//react imports
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";

//types
import type { PowerSource as PowerSourceData } from "../../types"; // A.13 types

//Helper functions
import { computeRoomClimate, itLoadOfRacks } from "../../helpers/roomClimate"; // 2.5.3 roomClimate
import { runningDevicesOfRack } from "../../helpers/inRackUps"; // 2.5.3.1 inRackUps
import { useRooms } from "../../helpers/hooks/roomOperations"; // A.10.1 roomOperations
import { useAuth } from "../../contexts/AuthProvider"; // 0.3 AuthProvider
import { useEquipmentRefs, useConnectionLines, type LineInput } from "../../helpers/hooks/connectionLines"; // 2.5.4 connectionLines
import { usePowerFlow } from "../../helpers/hooks/usePowerFlow"; // 2.5.2 usePowerFlow
import { useRoomData } from "../../helpers/hooks/useRoomData"; // 2.5.1 useRoomData
import { useEquipmentLabels } from "../../helpers/hooks/useEquipmentLabels"; // 2.5.5 useEquipmentLabels
import { useTrainerSelection } from "../../helpers/hooks/useTrainerSelection"; // 2.5.6 useTrainerSelection
import { isPowerCable } from "../../helpers/powerFlow"; // 2.5.2.1 powerFlow

//icons
import serverIcon from "../../assets/ServerIcon.svg";
import upsIcon from "../../assets/upsIcon.svg";
import pduIcon from "../../assets/PDU.svg";
import buttonIcon from "../../assets/AddButton.svg";
import fanIcon from "../../assets/fanIcon.svg";

//components
import PageHeading from "../PageHeading"; // A.1 PageHeading
import RackHoverOverlay from "../hoverCards/RackHoverCard"; // 2.2.2 RackHoverCard
import UpsHoverOverlay from "../hoverCards/UpsHoverCard"; // 2.2.3 UpsHoverCard
import PduHoverOverlay from "../hoverCards/PduHoverCard"; // 2.5.17 PduHoverCard
import ConnectionHoverOverlay from "../hoverCards/ConnectionHoverCard"; // 2.5.16 ConnectionHoverCard
import AddEquipmentOverlay from "../overlays/AddEquipmentOverlay"; // 2.5.9 AddEquipmentOverlay
import AddOutsideEquipmentOverlay from "../overlays/AddOutsideEquipmentOverlay"; // 2.5.10 AddOutsideEquipmentOverlay
import DisplayedRoomData from "../powerSimulation/DisplayedRoomData"; // 2.5.14 DisplayedRoomData
import ConnectionLine from "../powerSimulation/ConnectionLine"; // 2.5.12.1 ConnectionLine
import CableChangeOverlay from "../powerSimulation/CableChangeOverlay"; // 2.5.12 CableChangeOverlay
import PowerSource from "../powerSimulation/PowerSource"; // 2.5.8 PowerSource
import PowerLegend from "../powerSimulation/PowerLegend"; // 2.5.15 PowerLegend
import DamagedMark from "../powerSimulation/DamagedMark"; // 2.5.8.3 DamagedMark
import TrainerPanel from "../powerSimulation/TrainerPanel"; // 2.5.13 TrainerPanel
import OutsideEquipmentInfoOverlay from "../powerSimulation/OutsideEquipmentInfoOverlay"; // 2.5.11 OutsideEquipmentInfoOverlay
import { POWER_STATE_ICON_CLASS, DAMAGED_COLOR } from "../powerSimulation/powerStyles"; // 2.5.7 powerStyles

function DetailedRoom() {

    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const roomId = Number(id);

    const { roomsData } = useRooms();
    const { isTrainer } = useAuth(); // 0.3 useAuth

    // All equipment, cables and faults of this room (faults, cables, generators and fans are polled)
    const {
        roomRacks, roomUps, roomPdus, roomConnections, roomPowerSources, roomGrid, roomGenerators,
        roomFaults, outsideEquipment, devices, reloadPowerSources, reloadFans, reloadFaults, reloadConnections,
    } = useRoomData(roomId); // 2.5.1 useRoomData

    // For adding new rack, without explicitly choosing room ID
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    // For showing Cable Rearrange Overlay
    const [showCableOverlay, setShowCableOverlay] = useState(false);

    // For showing the add generator / fan overlay ("+" next to the grid)
    const [showOutsideOverlay, setShowOutsideOverlay] = useState(false);

    // Clicked generator / fan, its info overlay is open while set
    const [infoItem, setInfoItem] = useState<{ id: number; type: "generator" | "fan" } | null>(null);

    // Get current room object with parameters
    const currentRoom = roomsData.find(room => room.ID === roomId);

    // Which equipment has power, which cables are dead, and what is damaged
    const { deadCableIds, powerStateOf, faultOfEquipment, faultOfCable } = usePowerFlow({ // 2.5.2 usePowerFlow
        powerSources: roomPowerSources,
        ups: roomUps,
        pdus: roomPdus,
        racks: roomRacks,
        connections: roomConnections,
        faults: roomFaults,
    });
    const isDamaged = (equipmentId: number) => faultOfEquipment(equipmentId) === "damaged";
    const powerClass = (equipmentId: number) => POWER_STATE_ICON_CLASS[powerStateOf(equipmentId)];

    // A generator can only be added while the grid is damaged (the backend checks this too)
    const gridDown = roomGrid !== null && isDamaged(roomGrid.ID);

    // The AC runs on the grid, or on a working generator while the grid is down
    const acPowered = !gridDown || roomGenerators.some(generator => !isDamaged(generator.ID));

    // Power usage, cooling, temperature, humidity. Recalculated whenever rack power changes, e.g. after new cables
    const roomClimate = computeRoomClimate( // 2.5.3 computeRoomClimate
        itLoadOfRacks(roomRacks, devices, powerStateOf),
        currentRoom?.Capacity ?? 0,
        acPowered
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
                className="pointer-events-auto rack-item cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95"
            />
        ));
    };


    // Refs of every equipment icon (power source, racks, UPS, PDUs), keyed by Equipment ID.
    // All of them are Equipment IDs, so a connection's From/To ID points straight into this map
    const { equipmentRefs, setEquipmentRef } = useEquipmentRefs(); // 2.5.4 useEquipmentRefs

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
    const lines = useConnectionLines(linesContainerRef, equipmentRefs, lineInputs, [roomPowerSources, roomRacks, roomUps, roomPdus]); // 2.5.4 useConnectionLines

    // Currently hovered cable (line key = connection ID)
    const [hoveredLineKey, setHoveredLineKey] = useState<string | null>(null);

    const hoveredLine = lines.find(line => line.key === hoveredLineKey);
    const hoveredConnection = roomConnections.find(connection => String(connection.ID) === hoveredLineKey);

    // Equipment ID -> readable name ("Power grid", "Generator 1", "Rack 3", ...)
    const equipmentLabel = useEquipmentLabels({ // 2.5.5 useEquipmentLabels
        grid: roomGrid,
        generators: roomGenerators,
        racks: roomRacks,
        ups: roomUps,
        pdus: roomPdus,
    });

    // Trainer select mode: clicks select equipment / cables instead of their normal action
    const { selectMode, selectedTarget, handleSelectModeChange, selectCable, handleEquipmentClick, isSelected, selectionClass } =
        useTrainerSelection(equipmentLabel, roomConnections); // 2.5.6 useTrainerSelection

    // Grid or generator icon with its hover info
    const renderPowerSource = (source: PowerSourceData) => (
        <PowerSource
            type={source.Type}
            label={equipmentLabel(source.ID)}
            state={powerStateOf(source.ID)}
            faultType={faultOfEquipment(source.ID)}
            iconRef={setEquipmentRef(source.ID)}
            iconClassName={selectionClass(source.ID)}
            onClick={handleEquipmentClick(
                source.ID,
                source.Type === "generator" ? () => setInfoItem({ id: source.ID, type: "generator" }) : undefined
            )}
            t={t}
        />
    );

    // Place left (index 0) / right (index 1) of the grid:
    // a generator, a fan, a "+" opening the add overlay (only while the grid is down), or empty
    const renderOutsideSlot = (index: number) => {
        const item = outsideEquipment[index];

        return (
            <div className="pointer-events-none flex w-20 justify-center">
                {item?.Type === "fan" && (
                    <img
                        src={fanIcon}
                        alt={t("pages.rooms.detailedView.power.fan")}
                        onClick={() => !selectMode && setInfoItem({ id: item.ID, type: "fan" })}
                        className="pointer-events-auto h-20 w-auto cursor-pointer"
                    />
                )}
                {item && item.Type !== "fan" && renderPowerSource(item)}
                {!item && gridDown && (
                    <img
                        src={buttonIcon}
                        alt={t("pages.rooms.detailedView.power.addOutsideEquipment")}
                        title={t("pages.rooms.detailedView.power.addOutsideEquipment")}
                        onClick={() => setShowOutsideOverlay(true)}
                        className="pointer-events-auto h-20 w-20 cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95"
                    />
                )}
            </div>
        );
    };


    return (
        <>
            {/* Two overlays, Adding Equipment with + Button and cable rearrange*/}
            {selectedRoomId !== null && (
                <AddEquipmentOverlay
                    onClose={() => setSelectedRoomId(null)}
                    roomId={selectedRoomId}
                />
            )}

            {showOutsideOverlay && (
                <AddOutsideEquipmentOverlay
                    onClose={() => setShowOutsideOverlay(false)}
                    roomId={roomId}
                />
            )}

            {infoItem !== null && (
                <OutsideEquipmentInfoOverlay
                    equipmentId={infoItem.id}
                    label={infoItem.type === "fan" ? t("pages.rooms.detailedView.power.fan") : equipmentLabel(infoItem.id)}
                    info={t(`pages.rooms.detailedView.power.${infoItem.type}Info`)}
                    onClose={() => setInfoItem(null)}
                    onDeleted={() => {
                        reloadPowerSources();
                        reloadFans();
                        reloadConnections();
                    }}
                    t={t}
                />
            )}

            {showCableOverlay && (
                <CableChangeOverlay
                    onClose={() => setShowCableOverlay(false)}
                    onSaved={reloadConnections}
                    heading={`${t("pages.rooms.cardHeading")} ${id}`}
                    roomGrid={roomGrid}
                    roomGenerators={roomGenerators}
                    roomRacks={roomRacks}
                    roomUps={roomUps}
                    roomPdus={roomPdus}
                    roomConnections={roomConnections}
                />
            )}

            {/* Screens below 768px (breakpoint "m"): only this message is shown */}
            <div className="hidden max-m:flex min-h-screen items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold">
                    {t("pages.rooms.detailedView.smallScreen")}
                </h1>
            </div>

            {/* Everything else, hidden below 768px, Heading and cable setup change button */}
            <div className="flex min-h-screen w-full flex-col p-10 max-m:hidden">

                <PageHeading heading={`${t("pages.rooms.cardHeading")} ${id}`} />

                <button
                    onClick={() => setShowCableOverlay(true)}
                    className="mt-4 w-fit cursor-pointer rounded-[0.5rem] bg-[#6ADBAF] px-4 py-2 font-semibold text-white"
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
                    <DisplayedRoomData /* 2.5.14 */ climate={roomClimate} />

                    <PowerLegend /* 2.5.15 */ t={t} />

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
                                fromLabel={equipmentLabel(hoveredConnection.FromEquipmentID)}
                                toLabel={equipmentLabel(hoveredConnection.ToEquipmentID)}
                                language={i18n.language}
                                x={(hoveredLine.x1 + hoveredLine.x2) / 2}
                                y={(hoveredLine.y1 + hoveredLine.y2) / 2}
                                t={t}
                            />
                        )}

                        {/* Rows don't catch the mouse (only their items do), so lines behind the empty row space stay hoverable */}

                        {/* Above (outside) the room: generator / fan place, fixed grid, generator / fan place */}
                        {roomGrid && (
                            <div className="pointer-events-none mb-12 flex items-center justify-center gap-16">
                                {renderOutsideSlot(0)}
                                {renderPowerSource(roomGrid)}
                                {renderOutsideSlot(1)}
                            </div>
                        )}

                        {/* The room itself */}
                        <div className="pointer-events-none mx-auto flex w-full xl:w-[70%] flex-col gap-8 rounded-[0.5rem] border-[1rem] border-[#6ADBAF] p-6">

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

                                        {isDamaged(ups.ID) && <DamagedMark /* 2.5.8.3 */ />}

                                        <UpsHoverOverlay /* 2.2.3 */ ups={ups} powerState={powerStateOf(ups.ID)} faultType={faultOfEquipment(ups.ID)} t={t} />
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

                                            {isDamaged(pdu.ID) && <DamagedMark /* 2.5.8.3 */ />}

                                            <PduHoverOverlay /* 2.5.17 */ pdu={pdu} powerState={powerStateOf(pdu.ID)} faultType={faultOfEquipment(pdu.ID)} t={t} />
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

                                        {isDamaged(rack.ID) && <DamagedMark /* 2.5.8.3 */ />}

                                        <RackHoverOverlay
                                            rack={rack}
                                            powerState={powerStateOf(rack.ID)}
                                            faultType={faultOfEquipment(rack.ID)}
                                            // rack without power: servers still running on an in-rack UPS
                                            devicesOnRackUps={powerStateOf(rack.ID) === "unpowered"
                                                ? runningDevicesOfRack(rack.ID, "unpowered", devices).length
                                                : 0}
                                            t={t}
                                        />
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

// → Next in the book: 2.5.1 useRoomData  (src/helpers/hooks/useRoomData.ts)
