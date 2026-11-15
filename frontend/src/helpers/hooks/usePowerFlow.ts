import { useCallback, useMemo } from "react";

import type { Connection, Pdu, PowerSource, Rack, Ups } from "../../types";
import { computePowerFlow, type PowerNode, type PowerState } from "../powerFlow";

type RoomEquipment = {
    powerSource: PowerSource | null;
    ups: Ups[];
    pdus: Pdu[];
    racks: Rack[];
    connections: Connection[];
};

// Power state of every equipment piece and cable of one room.
// All inputs must be memoized by the caller, otherwise this recalculates on every render.
export function usePowerFlow({ powerSource, ups, pdus, racks, connections }: RoomEquipment) {
    const powerFlow = useMemo(() => {
        const nodes: PowerNode[] = [
            ...(powerSource ? [{ id: powerSource.ID, type: "grid" as const }] : []),
            ...ups.map(unit => ({ id: unit.ID, type: "ups" as const })),
            ...pdus.map(pdu => ({ id: pdu.ID, type: "pdu" as const })),
            ...racks.map(rack => ({ id: rack.ID, type: "rack" as const })),
        ];

        return computePowerFlow(nodes, connections);
    }, [powerSource, ups, pdus, racks, connections]);

    const powerStateOf = useCallback(
        (equipmentId: number): PowerState => powerFlow.states.get(equipmentId) ?? "unpowered",
        [powerFlow]
    );

    return { ...powerFlow, powerStateOf };
}
