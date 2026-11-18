/* ==========================================================================
 * BOOK THREAD A.12.3  rooms   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/services/api/rooms.ts
 *
 * Rooms requests.
 *
 * DATA - backend requests or types, renders no HTML.
 *
 * Uses: A.12.1 client, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import type { Room } from "../../types"; // A.13 types
import { getJson, sendJson } from "./client"; // A.12.1 client

export function getRoomData() {
    return getJson<Room[]>(`/rooms`, "Failed to get rooms");
}

export async function deleteRoom(id: number) {
    await sendJson("DELETE", `/deleteRoom/${id}`, undefined, "Failed to delete room");
}

// → Next in the book: A.12.4 equipment  (src/services/api/equipment.ts)
