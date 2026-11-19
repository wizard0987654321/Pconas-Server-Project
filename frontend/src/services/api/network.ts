import type { NetworkNode } from "../../types";
import { getJson, sendJson } from "./client";

// Network training: the request chain of each room

// Network nodes of all rooms (current settings only, never the correct baseline)
export function getNetworkNodesData() {
    return getJson<NetworkNode[]>(`/networkNodes`, "Failed to get network nodes");
}

// Trainer only: create the working network of a room
export function initNetwork(roomId: number) {
    return sendJson("POST", `/initNetwork/${roomId}`, undefined, "Failed to initialize network");
}
