//react imports 
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

//types
import type { Rack, Ups, Pdu, Connection } from "../types";

//helpers
import { addConnections } from "../services/api";
import { useEquipmentRefs, useConnectionLines, type LineInput } from "../helpers/hooks/connectionLines";

//icons
import serverIcon from "../assets/ServerIcon.svg";
import upsIcon from "../assets/upsIcon.svg";
import pduIcon from "../assets/PDU.svg";

//components
import ConnectionLine from "./ConnectionLine";

type EquipmentType = "ups" | "pdu" | "rack";

// Selected equipment: its Equipment ID and type
type SelectedEquipment = {
    id: number;
    type: EquipmentType;
};

// Cable chosen by the user, not saved in the DB yet
type NewConnection = {
    fromId: number;
    toId: number;
};

// Power flows UPS -> PDU -> Rack, so the "higher" equipment is always the From side
const POWER_LEVEL: Record<EquipmentType, number> = { ups: 0, pdu: 1, rack: 2 };

type CableChangeOverlayProps = {
    onClose: () => void;
    onSaved: () => void;
    heading: string;
    roomRacks: Rack[];
    roomUps: Ups[];
    roomPdus: Pdu[];
    roomConnections: Connection[];
};

function CableChangeOverlay({
    onClose,
    onSaved,
    heading,
    roomRacks,
    roomUps,
    roomPdus,
    roomConnections,
}: CableChangeOverlayProps) {

    const { t } = useTranslation();

    // First clicked equipment, waiting for the second one
    const [selected, setSelected] = useState<SelectedEquipment | null>(null);

    // Cables created in this overlay, only saved on submit
    const [newConnections, setNewConnections] = useState<NewConnection[]>([]);

    const [error, setError] = useState<string | null>(null);

    const handleEquipmentClick = (id: number, type: EquipmentType) => {
        // nothing selected yet, or same type clicked -> reselect
        if (!selected || (selected.type === type && selected.id !== id)) {
            setSelected({ id, type });
            return;
        }

        // same equipment clicked again -> unselect
        if (selected.id === id) {
            setSelected(null);
            return;
        }

        // different type -> new cable, From is always the higher one (UPS -> PDU -> Rack)
        const [fromId, toId] = POWER_LEVEL[selected.type] < POWER_LEVEL[type]
            ? [selected.id, id]
            : [id, selected.id];

        // skip cables that already exist (saved in DB or already drawn here), otherwise Save fails with 409
        const alreadyExists =
            roomConnections.some(c => c.FromEquipmentID === fromId && c.ToEquipmentID === toId) ||
            newConnections.some(c => c.fromId === fromId && c.toId === toId);

        if (!alreadyExists) {
            setNewConnections(prev => [...prev, { fromId, toId }]);
        }

        setSelected(null);
    };

    // saving into database
    const handleSubmit = async () => {
        try {
            await addConnections(
                newConnections.map(c => ({ fromEquipmentId: c.fromId, toEquipmentId: c.toId }))
            );
            onSaved();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to save cables");
        }
    };


    //Lines design: saved cables solid, new cables dashed
    const { equipmentRefs, setEquipmentRef } = useEquipmentRefs();
    const linesContainerRef = useRef<HTMLDivElement | null>(null);

    const lineInputs = useMemo<LineInput[]>(() => [
        ...roomConnections.map(c => ({
            key: `saved-${c.ID}`,
            fromId: c.FromEquipmentID,
            toId: c.ToEquipmentID,
            color: c.Color,
        })),
        ...newConnections.map((c, index) => ({
            key: `new-${index}`,
            fromId: c.fromId,
            toId: c.toId,
            color: "#FF6B6B",
            dashed: true,
        })),
    ], [roomConnections, newConnections]);

    const lines = useConnectionLines(linesContainerRef, equipmentRefs, lineInputs, [roomRacks, roomUps, roomPdus]);


    // Clickable equipment icon, selected one gets a green ring around
    const renderEquipment = (id: number, type: EquipmentType, icon: string, iconClassName = "") => (
        <img
            key={id}
            ref={setEquipmentRef(id)}
            src={icon}
            alt={type}
            onClick={() => handleEquipmentClick(id, type)}
            className={`rack-item cursor-pointer rounded-lg p-1 ${iconClassName} ${selected?.id === id ? "ring-4 ring-[#6ADBAF]" : ""}`}
        />
    );


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
            <div className="relative max-h-full w-full max-w-[90rem] overflow-auto rounded-[0.5rem] bg-white p-10">

                <h2 className="mb-6 text-2xl font-bold">{heading}</h2>

                {error && <p className="mb-4 text-red-600">{error}</p>}

                <div className="flex w-full flex-col rounded-[0.5rem] border-[1rem] border-[#6ADBAF] p-6">
                    <div ref={linesContainerRef} className="relative flex flex-col gap-24">

                {/* map through connection lines and display them one by one */}
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
                                />
                            ))}
                        </svg>

                        {/* UPS */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {roomUps.map(ups => renderEquipment(ups.ID, "ups", upsIcon, "max-w-[120px]"))}
                        </div>

                        {/* PDUs */}
                        {roomPdus.length > 0 && (
                            <div className="flex w-full items-center justify-between px-4">
                                {roomPdus.map(pdu => renderEquipment(pdu.ID, "pdu", pduIcon))}
                            </div>
                        )}

                        {/* Racks */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {roomRacks.map(rack => renderEquipment(rack.ID, "rack", serverIcon))}
                        </div>
                    </div>
                </div>

                {/* Cancel discards new cables, Save writes them to the DB */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded border border-[#6ADBAF] px-4 py-2"
                    >
                        {t("common.cancel")}
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={newConnections.length === 0}
                        className="cursor-pointer rounded bg-[#6ADBAF] px-4 py-2 text-white disabled:opacity-50"
                    >
                        {t("common.save")}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default CableChangeOverlay;
