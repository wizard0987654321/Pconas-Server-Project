import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Rack, Ups, Pdu, PowerSource } from "../../types";

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
