import type { Fault } from "../../types";
import { getJson, sendJson } from "./client";

// Faults caused by the trainer (damaged equipment / cables)

// Active faults of all rooms
export function getFaultsData() {
    return getJson<Fault[]>(`/faults`, "Failed to get faults");
}

// Trainer only: damage one piece of equipment or one cable
export function addFault(target: { equipmentId: number } | { connectionId: number }) {
    return sendJson("POST", `/addFault`, target, "Failed to add fault");
}

// Trainer only: repair (resolve) one fault
export function resolveFault(faultId: number) {
    return sendJson("PUT", `/resolveFault/${faultId}`, undefined, "Failed to repair");
}

// Trainer only: repair all faults of a room
export function resetFaults(roomId: number) {
    return sendJson("PUT", `/resetFaults/${roomId}`, undefined, "Failed to reset faults");
}
