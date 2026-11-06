import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import PageHeading from "./PageHeading";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
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

type Line = { id: number; x1: number; y1: number; x2: number; y2: number };

function DetailedRoom() {

    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const { roomsData } = useRooms();

    const [racksData, setRacksData] = useState<Rack[]>([]);
    const [upsData, setUpsData] = useState<Ups[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    // Refs and state for the PDU -> rack connection lines
    const frameRef = useRef<HTMLDivElement>(null);
    const leftPduRef = useRef<HTMLImageElement>(null);
    const rackRefs = useRef<Map<number, HTMLImageElement>>(new Map());
    const [lines, setLines] = useState<Line[]>([]);

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

    // Measure left PDU and rack icons, compute line coordinates
    useLayoutEffect(() => {
        const frame = frameRef.current;
        if (!frame) return;

        const measure = () => {
            const pdu = leftPduRef.current;
            if (!pdu) return;

            const f = frame.getBoundingClientRect();
            // absolute children are positioned relative to the padding box (inside the border)
            const originX = f.left + frame.clientLeft;
            const originY = f.top + frame.clientTop;
            const p = pdu.getBoundingClientRect();

            const x1 = p.left + p.width / 2 - originX;
            const y1 = p.bottom - originY;

            const next: Line[] = [];
            rackRefs.current.forEach((el, rackId) => {
                const r = el.getBoundingClientRect();
                next.push({
                    id: rackId,
                    x1,
                    y1,
                    x2: r.left + r.width / 2 - originX,
                    y2: r.top - originY,
                });
            });
            setLines(next);
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(frame);
        return () => observer.disconnect();
    }, [racksData, upsData, roomsData, id]);

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


                <div
                    ref={frameRef}
                    className="relative my-15 flex w-full flex-col gap-6 rounded-[0.5rem] border-[1rem] border-[#6ADBAF] p-6"
                >

                    {/* PDU -> rack connection lines */}
                    <svg className="pointer-events-none absolute inset-0 h-full w-full">
                        {lines.map(l => (
                            <line
                                key={l.id}
                                x1={l.x1}
                                y1={l.y1}
                                x2={l.x2}
                                y2={l.y2}
                                stroke="#6ADBAF"
                                strokeWidth={3}
                            />
                        ))}
                    </svg>

                    <DisplayedRoomData />

                    {/* UPS devices - First row */}
                    <div className="flex flex-wrap justify-center gap-4">

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
                            ref={leftPduRef}
                            src={pduIcon}
                            alt="PDU"
                            className="rack-item"
                        />

                        <img
                            src={pduIcon}
                            alt="PDU"
                            className="rack-item"
                        />

                    </div>

                    {/* Racks and free places - third row */}
                    <div className="relative flex flex-wrap justify-between gap-4">

                        {/* Existing racks */}
                        {roomRacks.map(rack => (
                            <div key={rack.ID} className="relative group flex justify-center">

                                <img
                                    ref={el => {
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