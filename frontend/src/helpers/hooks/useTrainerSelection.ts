/* ==========================================================================
 * BOOK THREAD 2.5.6  useTrainerSelection   (Chapter 2: Rooms)
 * File: src/helpers/hooks/useTrainerSelection.ts
 *
 * Trainer select mode: which equipment or cable is selected to be damaged / repaired in the TrainerPanel
 * (2.5.13).
 *
 * HOOK - only provides data / functions to the component that calls it, renders no HTML.
 *
 * Used by: 2.5 DetailedRoom
 * Uses: 2.5.13 TrainerPanel, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useState } from "react";

import type { Connection } from "../../types"; // A.13 types
import type { TrainerTarget } from "../../components/powerSimulation/TrainerPanel"; // 2.5.13 TrainerPanel

// Trainer selection: while select mode is on, a click selects the equipment / cable
// (instead of its normal action, e.g. opening the rack). The selected target is damaged / repaired in the TrainerPanel.
export function useTrainerSelection(equipmentLabel: (equipmentId: number) => string, roomConnections: Connection[]) {
    const [selectMode, setSelectMode] = useState(false);
    const [selectedTarget, setSelectedTarget] = useState<TrainerTarget | null>(null);

    // Turning select mode on / off always clears the selection
    const handleSelectModeChange = (on: boolean) => {
        setSelectMode(on);
        setSelectedTarget(null);
    };

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

    // Red ring around the selected equipment icon
    const selectionClass = (equipmentId: number) => isSelected("equipment", equipmentId) ? "rounded-lg ring-4 ring-[#DC2626]" : "";

    return { selectMode, selectedTarget, handleSelectModeChange, selectCable, handleEquipmentClick, isSelected, selectionClass };
}

// → Next in the book: 2.5.7 powerStyles  (src/components/powerSimulation/powerStyles.ts)
