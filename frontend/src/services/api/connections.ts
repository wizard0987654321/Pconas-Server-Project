import type { Connection } from "../../types";
import { getJson, sendJson } from "./client";

// Cables between equipment

export function getConnectionsData() {
    return getJson<Connection[]>(`/connections`, "Failed to get connections");
}

// Saves several new cables at once (all or nothing), typeId defaults to "Power" on the server.
// On error the backend's message is thrown (e.g. "Connection already exists"), the cable overlay shows it.
export function addConnections(
    connections: { fromEquipmentId: number; toEquipmentId: number; typeId?: number }[]
) {
    return sendJson("POST", `/addConnections`, { connections }, "Failed to add connections");
}
