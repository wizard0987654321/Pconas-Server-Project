import type { Connection, EquipmentType } from "../types";

// Power flow through a room, calculated only from equipment + cables (no React, no API calls).
//
// Rules:
// - Power sources (the fixed grid and emergency generators) are on unless damaged.
// - Power flows only in cable direction: From -> To (grid / generator -> UPS -> PDU -> rack).
// - A UPS that gets no power from the grid still feeds its cables from its battery.
//   Battery runtime is unlimited for now (time simulation comes in a later step).
// - Only "Power" cables carry electricity, network cables are ignored here.
// - Damaged equipment and damaged cables don't pass power on (damaged equipment is itself unpowered).

export type PowerState = "powered" | "battery" | "unpowered";

// Name of the power cable type in the ConnectionType table
export const POWER_CONNECTION_TYPE = "Power";

// Position in the power chain, a cable always goes from the lower to the higher level
export const POWER_LEVEL: Record<EquipmentType, number> = { grid: 0, generator: 0, ups: 1, pdu: 2, rack: 3 };

// Equipment pairs that must never be connected (in either direction).
// A power source can't feed a rack directly (there must be a UPS or PDU in between),
// and two power sources can't be connected to each other.
const FORBIDDEN_PAIRS: [EquipmentType, EquipmentType][] = [
    ["grid", "rack"],
    ["generator", "rack"],
    ["grid", "generator"],
];

export function isAllowedCable(a: EquipmentType, b: EquipmentType) {
    return !FORBIDDEN_PAIRS.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

export type PowerNode = {
    id: number;
    type: EquipmentType;
};

// IDs of damaged equipment and damaged cables
export type Damage = {
    equipmentIds: Set<number>;
    cableIds: Set<number>;
};

export type PowerFlow = {
    // State of every equipment piece, keyed by Equipment ID
    states: Map<number, PowerState>;
    // Power cables that carry no power: damaged, or their source has no power (drawn dashed)
    deadCableIds: Set<number>;
};

export function isPowerCable(connection: Connection) {
    return connection.TypeNameEN === POWER_CONNECTION_TYPE;
}

export function computePowerFlow(
    nodes: PowerNode[],
    connections: Connection[],
    damage: Damage = { equipmentIds: new Set(), cableIds: new Set() }
): PowerFlow {
    const powerCables = connections.filter(isPowerCable);

    // Equipment ID -> IDs of the equipment it feeds (damaged cables feed nothing)
    const feeds = new Map<number, number[]>();
    powerCables.filter(cable => !damage.cableIds.has(cable.ID)).forEach(cable => {
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
    // Damaged equipment never gets power, so it also never passes power on.
    const canReceivePower = (id: number) => states.get(id) === "unpowered" && !damage.equipmentIds.has(id);

    const spreadPower = (sourceIds: number[], state: PowerState) => {
        const queue: number[] = [];

        sourceIds.forEach(id => {
            if (!canReceivePower(id)) return;
            states.set(id, state);
            queue.push(id);
        });

        while (queue.length > 0) {
            const current = queue.shift()!;

            (feeds.get(current) ?? []).forEach(next => {
                if (!canReceivePower(next)) return;
                states.set(next, state);
                queue.push(next);
            });
        }
    };

    const idsOfType = (type: EquipmentType) => nodes.filter(node => node.type === type).map(node => node.id);

    // 1. Grid and generator power
    spreadPower([...idsOfType("grid"), ...idsOfType("generator")], "powered");

    // 2. UPS units that no power source reached run on battery
    spreadPower(idsOfType("ups"), "battery");

    // A power cable is dead when it is damaged or nothing flows into it
    const deadCableIds = new Set(
        powerCables
            .filter(cable =>
                damage.cableIds.has(cable.ID) ||
                (states.get(cable.FromEquipmentID) ?? "unpowered") === "unpowered"
            )
            .map(cable => cable.ID)
    );

    return { states, deadCableIds };
}
