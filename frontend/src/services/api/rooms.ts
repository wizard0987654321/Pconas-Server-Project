import type { Room } from "../../types";
import { getJson, sendJson } from "./client";

export function getRoomData() {
    return getJson<Room[]>(`/rooms`, "Failed to get rooms");
}

export async function deleteRoom(id: number) {
    await sendJson("DELETE", `/deleteRoom/${id}`, undefined, "Failed to delete room");
}
