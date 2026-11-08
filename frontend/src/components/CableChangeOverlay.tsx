import { useEffect, useRef, useState } from "react";
import type { Rack, Ups } from "../types";
import serverIcon from "../assets/ServerIcon.svg";
import upsIcon from "../assets/upsIcon.svg";
import pduIcon from "../assets/PDU.svg";
import buttonIcon from "../assets/AddButton.svg";
import ConnectionLine from "./ConnectionLine";

interface CableChangeOverlayProps {
    onClose: () => void;
    heading: string;
    roomRacks: Rack[];
    roomUps: Ups[];
    freePlaces: number;
}

function CableChangeOverlay({
    onClose,
    heading,
    roomRacks,
    roomUps,
    freePlaces,
}: CableChangeOverlayProps) {

    const firstPduRef = useRef<HTMLImageElement | null>(null);
    const secondPduRef = useRef<HTMLImageElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const rackRefs = useRef<(HTMLImageElement | null)[]>([]);

    const [firstLineX, setFirstLineX] = useState(0);
    const [secondLineX, setSecondLineX] = useState(0);
    const [rack1CenterX, setRack1CenterX] = useState(0);
    const [rack2CenterX, setRack2CenterX] = useState(0);

    useEffect(() => {
        const calculate = () => {
            const container = containerRef.current?.getBoundingClientRect();
            const firstPDU = firstPduRef.current?.getBoundingClientRect();
            const secondPDU = secondPduRef.current?.getBoundingClientRect();
            if (!container || !firstPDU || !secondPDU) return;

            setFirstLineX(firstPDU.x + firstPDU.width / 2 - container.left);
            setSecondLineX(secondPDU.x + secondPDU.width / 2 - container.left);

            const rack1 = rackRefs.current[0]?.getBoundingClientRect();
            const rack2 = rackRefs.current[1]?.getBoundingClientRect();
            if (rack1) setRack1CenterX(rack1.x + rack1.width / 2 - container.left);
            if (rack2) setRack2CenterX(rack2.x + rack2.width / 2 - container.left);
        };

        calculate();
        window.addEventListener("resize", calculate);
        return () => window.removeEventListener("resize", calculate);
    }, [roomRacks.length]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
            <div className="relative max-h-full w-full max-w-[90rem] overflow-auto rounded-[0.5rem] bg-white p-10">

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 cursor-pointer text-2xl font-bold"
                    aria-label="Close"
                >
                    ✕
                </button>

                <h2 className="mb-6 text-2xl font-bold">{heading}</h2>

                <div className="flex w-full flex-col rounded-[0.5rem] border-[1rem] border-[#6ADBAF] p-6">

                    {/* UPS devices - first row */}
                    <div className="my-6 flex flex-wrap justify-center gap-4">
                        {roomUps.map(ups => (
                            <div key={ups.ID} className="flex justify-center">
                                <img
                                    src={upsIcon}
                                    alt="UPS Icon"
                                    className="rack-item max-w-[120px]"
                                />
                            </div>
                        ))}
                    </div>

                    {/* PDUs */}
                    <div className="flex w-full items-center justify-between px-4">
                        <img ref={firstPduRef} src={pduIcon} alt="PDU" className="rack-item" />
                        <img ref={secondPduRef} src={pduIcon} alt="PDU" className="rack-item" />
                    </div>

                    {/* Lines */}
                    <div ref={containerRef} className="w-full">
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

                    {/* Racks and free places */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {roomRacks.map((rack, index) => (
                            <div key={rack.ID} className="flex justify-center">
                                <img
                                    ref={(el) => { rackRefs.current[index] = el; }}
                                    src={serverIcon}
                                    alt="Server Icon"
                                    className="rack-item"
                                />
                            </div>
                        ))}

                        {Array.from({ length: freePlaces }, (_, index) => (
                            <img
                                key={`free-${index}`}
                                src={buttonIcon}
                                alt="Free place"
                                className="rack-item"
                            />
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default CableChangeOverlay;