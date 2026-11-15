import { useState } from "react";

import type { Fault } from "../../types";
import { addFault, resolveFault, resetFaults } from "../../services/api";

// What the trainer clicked: a piece of equipment or a cable
export type TrainerTarget = {
    kind: "equipment" | "cable";
    id: number;     // Equipment ID or Connection ID
    label: string;  // e.g. "Rack 3" or "UPS 1 → PDU 2"
};

interface TrainerPanelProps {
    roomId: number;
    roomFaults: Fault[];
    // While select mode is on, clicks on equipment / cables select them instead of their normal action
    selectMode: boolean;
    onSelectModeChange: (on: boolean) => void;
    selected: TrainerTarget | null;
    // Called after every change, so the room reloads its faults
    onChanged: () => void;
    t: (key: string) => string;
}

// Trainer only: damage / repair the selected equipment or cable, or repair everything in the room
function TrainerPanel({ roomId, roomFaults, selectMode, onSelectModeChange, selected, onChanged, t }: TrainerPanelProps) {
    const [error, setError] = useState<string | null>(null);

    // Active fault of the selected item (undefined = it is intact)
    const selectedFault = selected && roomFaults.find(fault =>
        selected.kind === "equipment" ? fault.EquipmentID === selected.id : fault.ConnectionID === selected.id
    );

    // Runs a backend action, then reloads the faults or shows the error
    const run = async (action: () => Promise<unknown>) => {
        setError(null);
        try {
            await action();
            onChanged();
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    };

    const handleDamage = () => {
        if (!selected) return;
        run(() => addFault(selected.kind === "equipment" ? { equipmentId: selected.id } : { connectionId: selected.id }));
    };

    const handleRepair = () => {
        if (!selectedFault) return;
        run(() => resolveFault(selectedFault.ID));
    };

    const handleReset = () => run(() => resetFaults(roomId));

    const buttonClass = "cursor-pointer rounded-[0.5rem] px-4 py-2 font-semibold disabled:cursor-default disabled:opacity-50";

    return (
        <div className="flex flex-col gap-3 rounded-[0.5rem] border-2 border-[#DC2626] p-4">
            <h2 className="font-bold">{t("pages.rooms.detailedView.trainer.title")}</h2>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={() => onSelectModeChange(!selectMode)}
                    className={`${buttonClass} ${selectMode ? "bg-[#DC2626] text-white" : "border-2 border-[#DC2626]"}`}
                >
                    {t(selectMode ? "pages.rooms.detailedView.trainer.selectModeOff" : "pages.rooms.detailedView.trainer.selectModeOn")}
                </button>

                <button onClick={handleReset} disabled={roomFaults.length === 0} className={`${buttonClass} border-2 border-[#DC2626]`}>
                    {t("pages.rooms.detailedView.trainer.resetAll")}
                </button>
            </div>

            {selectMode && (
                <div className="flex flex-wrap items-center gap-3">
                    {selected ? (
                        <>
                            <span>
                                {t("pages.rooms.detailedView.trainer.selected")}: <strong>{selected.label}</strong>
                            </span>

                            {selectedFault ? (
                                <button onClick={handleRepair} className={`${buttonClass} bg-[#6ADBAF]`}>
                                    {t("pages.rooms.detailedView.trainer.repair")}
                                </button>
                            ) : (
                                <button onClick={handleDamage} className={`${buttonClass} bg-[#DC2626] text-white`}>
                                    {t("pages.rooms.detailedView.trainer.damage")}
                                </button>
                            )}
                        </>
                    ) : (
                        <span>{t("pages.rooms.detailedView.trainer.hint")}</span>
                    )}
                </div>
            )}

            {error && <p className="text-[#DC2626]">{error}</p>}
        </div>
    );
}

export default TrainerPanel;
