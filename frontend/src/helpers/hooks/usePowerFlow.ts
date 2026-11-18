/* ==========================================================================
 * BOOK THREAD 2.5.2  usePowerFlow   (Chapter 2: Rooms)
 * File: src/helpers/hooks/usePowerFlow.ts
 *
 * Wraps powerFlow.ts (2.5.2.1) in useMemo. Gives the power state and fault of every equipment piece and cable
 * of the room.
 *
 * HOOK - only provides data / functions to the component that calls it, renders no HTML.
 *
 * Used by: 2.5 DetailedRoom, 2.6 DetailedRack
 * Uses: 2.5.2.1 powerFlow, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useCallback, useMemo } from "react";

import type { Connection, Fault, FaultType, Pdu, PowerSource, Rack, Ups } from "../../types"; // A.13 types
import { computePowerFlow, type PowerNode, type PowerState } from "../powerFlow"; // 2.5.2.1 powerFlow

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

        return computePowerFlow(nodes, connections, { // 2.5.2.1 computePowerFlow
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

// → Next in the book: 2.5.2.1 powerFlow  (src/helpers/powerFlow.ts)
