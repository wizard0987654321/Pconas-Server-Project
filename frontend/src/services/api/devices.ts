import type { Device, DeviceType } from "../../types";
import { getJson, sendJson } from "./client";

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
