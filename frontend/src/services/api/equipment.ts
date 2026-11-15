import type { Rack, Ups, Pdu, PowerSource } from "../../types";
import { getJson, sendJson } from "./client";

// Racks, UPS, PDUs and power sources (all of them are Equipment rows in the DB)

export function getRackData() {
    return getJson<Rack[]>(`/racks`, "Failed to get racks");
}

export function getUpsData() {
    return getJson<Ups[]>(`/ups`, "Failed to get UPS");
}

export function getPduData() {
    return getJson<Pdu[]>(`/pdus`, "Failed to get PDUs");
}

export function getPowerSourceData() {
    return getJson<PowerSource[]>(`/powerSources`, "Failed to get power sources");
}

export async function deleteRack(id: number) {
    await sendJson("DELETE", `/deleteRack/${id}`, undefined, "Failed to delete rack");
}
