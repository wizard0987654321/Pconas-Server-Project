/* ==========================================================================
 * BOOK THREAD 2.5.3.1  inRackUps   (Chapter 2: Rooms)
 * File: src/helpers/inRackUps.ts
 *
 * In-rack UPS logic: power state of each device in a rack, and the "Electricity (connected via)" choice of
 * the device forms (2.6.1, 2.6.2).
 *
 * HELPER - plain functions / settings, no React, renders no HTML.
 *
 * Used by: 2.5 DetailedRoom, 2.5.3 roomClimate, 2.6 DetailedRack, 2.6.1 AddDeviceOverlay,
 *   2.6.2 EditDeviceOverlay
 * Uses: 2.5.2.1 powerFlow, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import type { Device } from "../types"; // A.13 types
import type { PowerState } from "./powerFlow"; // 2.5.2.1 powerFlow

// What an in-rack UPS delivers: the rack's power while it gets some, otherwise its own battery.
// Not plugged in (ElectricityConnected = false) means it gets nothing from the rack feed -> battery.
function upsOutput(ups: Device, rackState: PowerState): PowerState {
    const input = ups.ElectricityConnected ? rackState : "unpowered";
    return input === "unpowered" ? "battery" : input;
}

// Power state of one device in a rack, from the rack's state (room power flow):
// - in-rack UPS: see upsOutput
// - not plugged in: no power
// - plugged into an in-rack UPS: whatever that UPS delivers
// - plugged into the rack feed: same as the rack
export function devicePowerState(device: Device, rackState: PowerState, devices: Device[]): PowerState {
    if (device.IsUps) return upsOutput(device, rackState);
    if (!device.ElectricityConnected) return "unpowered";

    const ups = device.PoweredByDeviceID != null ? devices.find(d => d.ID === device.PoweredByDeviceID) : undefined;
    return ups ? upsOutput(ups, rackState) : rackState;
}

// Devices of a rack that are running (have power from the rack or a battery).
// In-rack UPS units themselves are left out: they only pass power on, the servers behind them are the load.
export function runningDevicesOfRack(rackId: number, rackState: PowerState, devices: Device[]) {
    return devices.filter(device =>
        device.RackID === rackId &&
        !device.IsUps &&
        devicePowerState(device, rackState, devices) !== "unpowered"
    );
}

// One "Electricity" choice in the device forms, stored in the DB as two columns:
// "none"     -> not plugged in        (ElectricityConnected = false, PoweredByDeviceID = null)
// "0"        -> rack power feed (PDU) (ElectricityConnected = true,  PoweredByDeviceID = null)
// UPS ID     -> in-rack UPS           (ElectricityConnected = true,  PoweredByDeviceID = UPS ID)
export const NOT_CONNECTED = "none";
export const RACK_FEED = "0";

export function electricityValue(device: Device) {
    if (!device.ElectricityConnected) return NOT_CONNECTED;
    return device.PoweredByDeviceID != null ? String(device.PoweredByDeviceID) : RACK_FEED;
}

export function electricityFields(value: string) {
    return {
        electricityConnected: value !== NOT_CONNECTED,
        poweredByDeviceId: value === NOT_CONNECTED || value === RACK_FEED ? null : Number(value),
    };
}

// Dropdown options: not connected, rack feed, and the in-rack UPS devices of the rack (never the device itself)
export function electricityOptions(devices: Device[], rackId: number | null, t: (key: string) => string, ownDeviceId?: number) {
    return [
        { value: NOT_CONNECTED, label: t("pages.devices.form.notConnected") },
        { value: RACK_FEED, label: t("pages.devices.form.rackFeed") },
        ...devices
            .filter(device => device.RackID === rackId && device.IsUps && device.ID !== ownDeviceId)
            .map(device => ({ value: device.ID, label: `${device.TypeName} (${device.InternalID})` })),
    ];
}

// Same rules as the backend: only a UPS of the same rack, and a UPS can't hang on another UPS
// Returns the i18n key of the error, or null
export function electricityError(devices: Device[], rackId: number, typeIsUps: boolean, value: string) {
    if (value === NOT_CONNECTED || value === RACK_FEED || value === "") return null;
    if (typeIsUps) return "pages.devices.form.validation.upsOnUps";
    const ups = devices.find(device => device.ID === Number(value));
    if (!ups || ups.RackID !== rackId) return "pages.devices.form.validation.upsOtherRack";
    return null;
}

// → Next in the book: 2.5.4 connectionLines  (src/helpers/hooks/connectionLines.ts)
