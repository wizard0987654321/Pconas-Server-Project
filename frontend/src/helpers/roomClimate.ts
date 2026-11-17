import type { Device, Rack } from "../types";
import type { PowerState } from "./powerFlow";
import { runningDevicesOfRack } from "./inRackUps";

// Simple room climate model: not exact physics, but realistic orders of magnitude.
//
// - Every running device (plugged in and getting power from the rack or from an in-rack UPS battery)
//   draws WATTS_PER_UNIT per height unit (U) it occupies.
// - All electricity used by the IT equipment turns into heat, so the AC has to remove
//   exactly that much heat (cooling load = IT load).
// - The AC is sized per rack place of the room. Up to 100 % load it holds the set temperature.
// - Above 100 % the room heats up. Without power (grid down, no working generator) the AC
//   removes no heat at all, so all the IT heat warms the room.
// - The amount of water in the air stays the same, so the
//   RELATIVE humidity drops when the air gets warmer (warm air can hold more water).

const WATTS_PER_UNIT = 250;
const AC_WATTS_PER_RACK_PLACE = 5000;

const SET_TEMPERATURE_C = 22;
const SET_HUMIDITY_PERCENT = 45;
// Temperature rise per heat the AC doesn't remove, measured in full AC capacities
// (e.g. 150 % load -> half a capacity too much -> +7.5 °C; AC off at 60 % load -> +9 °C)
const DEGREES_PER_FULL_OVERLOAD = 15;
// Without AC the heat has nowhere to go and a server room heats up within minutes,
// so as soon as anything runs the room is at least this much warmer (22 + 13 = 35 °C, clearly critical)
const AC_OFF_EXTRA_C = 13;
const MAX_TEMPERATURE_C = 50;

export type RoomClimate = {
    itLoadW: number;
    coolingCapacityW: number;
    coolingPercent: number;
    acPowered: boolean;
    temperatureC: number;
    humidityPercent: number;
};

// Power draw of one device in W (positions are inclusive, From 3 To 4 = 2U)
export function deviceWatts(device: Device) {
    return (device.PositionTo - device.PositionFrom + 1) * WATTS_PER_UNIT;
}

// Power usage of a room in W: running devices of all racks (power from grid, generator,
// cabinet UPS battery or in-rack UPS battery)
export function itLoadOfRacks(racks: Rack[], devices: Device[], rackStateOf: (rackId: number) => PowerState) {
    return racks
        .flatMap(rack => runningDevicesOfRack(rack.ID, rackStateOf(rack.ID), devices))
        .reduce((sum, device) => sum + deviceWatts(device), 0);
}

// Saturation vapour pressure of air in hPa (Magnus formula)
function saturationPressure(temperatureC: number) {
    return 6.112 * Math.exp((17.62 * temperatureC) / (243.12 + temperatureC));
}

export function computeRoomClimate(itLoadW: number, rackPlaces: number, acPowered: boolean): RoomClimate {
    const coolingCapacityW = rackPlaces * AC_WATTS_PER_RACK_PLACE;
    const coolingPercent = coolingCapacityW > 0 ? (itLoadW / coolingCapacityW) * 100 : 0;

    // Only heat the AC can't remove warms the room (all of it while the AC has no power)
    const removableHeatW = acPowered ? coolingCapacityW : 0;
    const unremovedHeatW = Math.max(0, itLoadW - removableHeatW);
    const overload = coolingCapacityW > 0 ? unremovedHeatW / coolingCapacityW : 0;
    const acOffExtraC = !acPowered && itLoadW > 0 ? AC_OFF_EXTRA_C : 0;
    const temperatureC = Math.min(
        MAX_TEMPERATURE_C,
        SET_TEMPERATURE_C + acOffExtraC + overload * DEGREES_PER_FULL_OVERLOAD
    );

    // Same water in the air, warmer air -> lower relative humidity
    const humidityPercent =
        SET_HUMIDITY_PERCENT * saturationPressure(SET_TEMPERATURE_C) / saturationPressure(temperatureC);

    return { itLoadW, coolingCapacityW, coolingPercent, acPowered, temperatureC, humidityPercent };
}
