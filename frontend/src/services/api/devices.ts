/* ==========================================================================
 * BOOK THREAD A.12.6  devices   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/services/api/devices.ts
 *
 * Devices and device types requests.
 *
 * DATA - backend requests or types, renders no HTML.
 *
 * Uses: A.12.1 client, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import type { Device, DeviceType } from "../../types"; // A.13 types
import { getJson, sendJson } from "./client"; // A.12.1 client

// Device types and devices (servers etc. mounted in racks)

export function getDeviceTypesData() {
    return getJson<DeviceType[]>(`/deviceTypes`, "Failed to get device types");
}

export function getDevicesData() {
    return getJson<Device[]>(`/devices`, "Failed to get devices");
}

export async function deleteDeviceType(id: number) {
    await sendJson("DELETE", `/deleteDeviceType/${id}`, undefined, "Failed to delete device type");
}

export async function deleteDevice(id: number) {
    await sendJson("DELETE", `/deleteDevice/${id}`, undefined, "Failed to delete device");
}

// → Next in the book: A.12.7 services  (src/services/api/services.ts)
