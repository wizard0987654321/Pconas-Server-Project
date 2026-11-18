/* ==========================================================================
 * BOOK THREAD A.12.5  connections   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/services/api/connections.ts
 *
 * Cable requests (load, add, delete).
 *
 * DATA - backend requests or types, renders no HTML.
 *
 * Uses: A.12.1 client, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import type { Connection } from "../../types"; // A.13 types
import { getJson, sendJson } from "./client"; // A.12.1 client

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

// Deletes several saved cables at once
export function deleteConnections(ids: number[]) {
    return sendJson("POST", `/deleteConnections`, { ids }, "Failed to delete connections");
}

// → Next in the book: A.12.6 devices  (src/services/api/devices.ts)
