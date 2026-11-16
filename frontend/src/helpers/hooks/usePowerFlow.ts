import { useCallback, useMemo } from "react";

import type { Connection, Fault, FaultType, Pdu, PowerSource, Rack, Ups } from "../../types";
import { computePowerFlow, type PowerNode, type PowerState } from "../powerFlow";

type RoomEquipment = {
    powerSources: PowerSource[];
    ups: Ups[];
    pdus: Pdu[];
    racks: Rack[];
    connections: Connection[];
    faults: Fault[];
};

// Power state and faults of every equipment piece and cable of one room.
// All inputs must be memoized by the caller, otherwise this recalculates on every render.
export function usePowerFlow({ powerSources, ups, pdus, racks, connections, faults }: RoomEquipment) {
    // Active fault per equipment / per cable (Equipment ID or Connection ID -> fault type)
    const { equipmentFaults, cableFaults } = useMemo(() => {
        const equipmentFaults = new Map<number, FaultType>();
        const cableFaults = new Map<number, FaultType>();

        faults.forEach(fault => {
            if (fault.EquipmentID !== null) equipmentFaults.set(fault.EquipmentID, fault.FaultType);
            if (fault.ConnectionID !== null) cableFaults.set(fault.ConnectionID, fault.FaultType);
        });

        return { equipmentFaults, cableFaults };
    }, [faults]);

    const powerFlow = useMemo(() => {
        const nodes: PowerNode[] = [
            ...powerSources.map(source => ({ id: source.ID, type: source.Type })),
            ...ups.map(unit => ({ id: unit.ID, type: "ups" as const })),
            ...pdus.map(pdu => ({ id: pdu.ID, type: "pdu" as const })),
            ...racks.map(rack => ({ id: rack.ID, type: "rack" as const })),
        ];

        // Damaged parts block the power
        const damagedIds = (faultMap: Map<number, FaultType>) =>
            new Set([...faultMap].filter(([, type]) => type === "damaged").map(([id]) => id));

        return computePowerFlow(nodes, connections, {
            equipmentIds: damagedIds(equipmentFaults),
            cableIds: damagedIds(cableFaults),
        });
    }, [powerSources, ups, pdus, racks, connections, equipmentFaults, cableFaults]);

    const powerStateOf = useCallback(
        (equipmentId: number): PowerState => powerFlow.states.get(equipmentId) ?? "unpowered",
        [powerFlow]
    );

    const faultOfEquipment = useCallback((equipmentId: number) => equipmentFaults.get(equipmentId), [equipmentFaults]);
    const faultOfCable = useCallback((connectionId: number) => cableFaults.get(connectionId), [cableFaults]);

    return { ...powerFlow, powerStateOf, faultOfEquipment, faultOfCable };
}
