import type { Connection, EquipmentType } from "../types";

// Power flow through a room, calculated only from equipment + cables (no React, no API calls).
//
// Rules:
// - The grid (fixed outer power source) is always on for now (grid outages come in a later step).
// - Power flows only in cable direction: From -> To (grid -> UPS -> PDU -> rack).
// - A UPS that gets no power from the grid still feeds its cables from its battery.
//   Battery runtime is unlimited for now (time simulation comes in a later step).
// - Only "Power" cables carry electricity, network cables are ignored here.

export type PowerState = "powered" | "battery" | "unpowered";

// Name of the power cable type in the ConnectionType table
export const POWER_CONNECTION_TYPE = "Power";

// Position in the power chain, a cable always goes from the lower to the higher level
export const POWER_LEVEL: Record<EquipmentType, number> = { grid: 0, ups: 1, pdu: 2, rack: 3 };

// Equipment pairs that must never be connected (in either direction).
// The grid can't feed a rack directly, there must be a UPS or PDU in between.
const FORBIDDEN_PAIRS: [EquipmentType, EquipmentType][] = [["grid", "rack"]];

export function isAllowedCable(a: EquipmentType, b: EquipmentType) {
    return !FORBIDDEN_PAIRS.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

export type PowerNode = {
    id: number;
    type: EquipmentType;
};

export type PowerFlow = {
    // State of every equipment piece, keyed by Equipment ID
    states: Map<number, PowerState>;
    // Power cables whose source has no power (drawn dashed)
    deadCableIds: Set<number>;
};

export function isPowerCable(connection: Connection) {
    return connection.TypeNameEN === POWER_CONNECTION_TYPE;
}

export function computePowerFlow(nodes: PowerNode[], connections: Connection[]): PowerFlow {
    const powerCables = connections.filter(isPowerCable);

    // Equipment ID -> IDs of the equipment it feeds
    const feeds = new Map<number, number[]>();
    powerCables.forEach(cable => {
        const targets = feeds.get(cable.FromEquipmentID) ?? [];
        targets.push(cable.ToEquipmentID);
        feeds.set(cable.FromEquipmentID, targets);
    });

    // Everything starts without power
    const states = new Map<number, PowerState>(nodes.map(node => [node.id, "unpowered"]));

    // Breadth-first search from the sources along the cables.
    // Only equipment that is still "unpowered" gets the new state, so:
    // - grid power (first pass) is never overwritten by battery power (second pass)
    // - cable loops can't cause an endless loop
    // - cables to equipment that is not in `nodes` are ignored
    const spreadPower = (sourceIds: number[], state: PowerState) => {
        const queue: number[] = [];

        sourceIds.forEach(id => {
            if (states.get(id) !== "unpowered") return;
            states.set(id, state);
            queue.push(id);
        });

        while (queue.length > 0) {
            const current = queue.shift()!;

            (feeds.get(current) ?? []).forEach(next => {
                if (states.get(next) !== "unpowered") return;
                states.set(next, state);
                queue.push(next);
            });
        }
    };

    const idsOfType = (type: EquipmentType) => nodes.filter(node => node.type === type).map(node => node.id);

    // 1. Grid power
    spreadPower(idsOfType("grid"), "powered");

    // 2. UPS units that the grid didn't reach run on battery
    spreadPower(idsOfType("ups"), "battery");

    // A power cable is dead when nothing flows into it
    const deadCableIds = new Set(
        powerCables
            .filter(cable => (states.get(cable.FromEquipmentID) ?? "unpowered") === "unpowered")
            .map(cable => cable.ID)
    );

    return { states, deadCableIds };
}
