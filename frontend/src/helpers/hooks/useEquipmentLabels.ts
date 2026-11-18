/* ==========================================================================
 * BOOK THREAD 2.5.5  useEquipmentLabels   (Chapter 2: Rooms)
 * File: src/helpers/hooks/useEquipmentLabels.ts
 *
 * Turns equipment IDs into readable names ("Rack 3", "PDU 1", "Generator 2").
 *
 * HOOK - only provides data / functions to the component that calls it, renders no HTML.
 *
 * Used by: 2.5 DetailedRoom, 2.6 DetailedRack
 * Uses: A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Rack, Ups, Pdu, PowerSource } from "../../types"; // A.13 types

type RoomEquipment = {
    grid: PowerSource | null;
    generators: PowerSource[];
    racks: Rack[];
    ups: Ups[];
    pdus: Pdu[];
};

// Equipment ID -> readable name ("Power grid", "Generator 1", "Rack 3", "UPS 1", "PDU 2"),
// used in hover divs, the trainer selection and the generator info overlay
export function useEquipmentLabels({ grid, generators, racks, ups, pdus }: RoomEquipment) {
    const { t } = useTranslation();

    const labels = useMemo(() => {
        const labels = new Map<number, string>();
        if (grid) labels.set(grid.ID, t("pages.rooms.detailedView.power.grid"));
        generators.forEach((generator, index) => labels.set(generator.ID, `${t("pages.rooms.detailedView.power.generator")} ${index + 1}`));
        racks.forEach(rack => labels.set(rack.ID, `${t("common.rack")} ${rack.RackNumber}`));
        ups.forEach(unit => labels.set(unit.ID, `${t("common.ups")} ${unit.UPSNumber}`));
        pdus.forEach(pdu => labels.set(pdu.ID, `${t("common.pdu")} ${pdu.PDUNumber}`));
        return labels;
    }, [grid, generators, racks, ups, pdus, t]);

    return useCallback(
        (equipmentId: number) => labels.get(equipmentId) ?? t("common.unknown"),
        [labels, t]
    );
}

// → Next in the book: 2.5.6 useTrainerSelection  (src/helpers/hooks/useTrainerSelection.ts)
