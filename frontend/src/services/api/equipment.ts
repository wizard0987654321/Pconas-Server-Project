/* ==========================================================================
 * BOOK THREAD A.12.4  equipment   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/services/api/equipment.ts
 *
 * Racks, UPS, PDUs, power sources, generators and fans requests.
 *
 * DATA - backend requests or types, renders no HTML.
 *
 * Uses: A.12.1 client, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import type { Rack, Ups, Pdu, PowerSource, Fan } from "../../types"; // A.13 types
import { getJson, sendJson } from "./client"; // A.12.1 client

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

export function getFanData() {
    return getJson<Fan[]>(`/fans`, "Failed to get fans");
}

// Removes a generator together with its cables
// Generator or fan from the outside slots
export async function deleteOutsideEquipment(id: number) {
    await sendJson("DELETE", `/deleteOutsideEquipment/${id}`, undefined, "Failed to delete equipment");
}

export async function deleteRack(id: number) {
    await sendJson("DELETE", `/deleteRack/${id}`, undefined, "Failed to delete rack");
}

// → Next in the book: A.12.5 connections  (src/services/api/connections.ts)
