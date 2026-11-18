/* ==========================================================================
 * BOOK THREAD 2.5.1  useRoomData   (Chapter 2: Rooms)
 * File: src/helpers/hooks/useRoomData.ts
 *
 * Loads all data of one room (racks, UPS, PDUs, devices, cables, faults, generators, fans) and reloads the
 * changing parts every 3 seconds.
 *
 * HOOK - only provides data / functions to the component that calls it, renders no HTML.
 *
 * Used by: 2.5 DetailedRoom, 2.6 DetailedRack
 * Uses: 2.5.1.1 usePolling, A.12 api/index, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useEffect, useMemo, useState } from "react";

import type { Rack, Ups, Pdu, Connection, Fault, Fan, Device, PowerSource } from "../../types"; // A.13 types
import {
    getRackData, getUpsData, getPduData, getPowerSourceData, getFanData,
    getConnectionsData, getFaultsData, getDevicesData,
} from "../../services/api"; // A.12 api/index
import { usePolling, keepIfUnchanged } from "./usePolling"; // 2.5.1.1 usePolling

// How often faults, cables, generators and fans are reloaded (live sync between trainer and trainee)
const POLL_INTERVAL_MS = 3000;

// All data of one room for the detailed room view.
// - Racks, UPS, PDUs and devices are loaded once (they don't change during training).
// - Faults, cables, generators and fans change during training (trainer damages,
//   trainee rewires / adds generators and fans), so they are reloaded every few seconds.
// Everything is filtered to the room and memoized, so the line and power calculations
// only re-run when data really changes.
export function useRoomData(roomId: number) {
    const [racksData, setRacksData] = useState<Rack[]>([]);
    const [upsData, setUpsData] = useState<Ups[]>([]);
    const [pduData, setPduData] = useState<Pdu[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [powerSourceData, setPowerSourceData] = useState<PowerSource[]>([]);
    const [connectionsData, setConnectionsData] = useState<Connection[]>([]);
    const [faultsData, setFaultsData] = useState<Fault[]>([]);
    const [fansData, setFansData] = useState<Fan[]>([]);

    useEffect(() => {
        getRackData()
            .then(setRacksData)
            .catch((err) => console.error("Rack API error", err));

        getUpsData()
            .then(setUpsData)
            .catch((err) => console.error("UPS API error", err));

        getPduData()
            .then(setPduData)
            .catch((err) => console.error("PDU API error", err));

        getDevicesData()
            .then(setDevices)
            .catch((err) => console.error("Devices API error", err));
    }, []);

    // Grid + generators, also called after deleting a generator
    const reloadPowerSources = () =>
        getPowerSourceData()
            .then(sources => setPowerSourceData(keepIfUnchanged(sources)))
            .catch((err) => console.error("Power source API error", err));

    const reloadFans = () =>
        getFanData()
            .then(fans => setFansData(keepIfUnchanged(fans)))
            .catch((err) => console.error("Fan API error", err));

    // Also called by the trainer panel after damaging / repairing
    const reloadFaults = () =>
        getFaultsData()
            .then(faults => setFaultsData(keepIfUnchanged(faults)))
            .catch((err) => console.error("Faults API error", err));

    // Also called by the cable overlay after saving new cables
    const reloadConnections = () =>
        getConnectionsData()
            .then(connections => setConnectionsData(keepIfUnchanged(connections)))
            .catch((err) => console.error("Connections API error", err));

    usePolling(() => {
        reloadFaults();
        reloadConnections();
        reloadPowerSources();
        reloadFans();
    }, POLL_INTERVAL_MS);

    const roomRacks = useMemo(() => racksData.filter(rack => rack.RoomID === roomId), [racksData, roomId]);
    const roomUps = useMemo(() => upsData.filter(ups => ups.RoomID === roomId), [upsData, roomId]);
    const roomPdus = useMemo(() => pduData.filter(pdu => pdu.RoomID === roomId), [pduData, roomId]);
    const roomConnections = useMemo(() => connectionsData.filter(connection => connection.RoomID === roomId), [connectionsData, roomId]);
    const roomPowerSources = useMemo(() => powerSourceData.filter(source => source.RoomID === roomId), [powerSourceData, roomId]);
    const roomGrid = roomPowerSources.find(source => source.Type === "grid") ?? null;
    const roomGenerators = useMemo(() => roomPowerSources.filter(source => source.Type === "generator"), [roomPowerSources]);
    const roomFaults = useMemo(() => faultsData.filter(fault => fault.RoomID === roomId), [faultsData, roomId]);

    // What stands in the two places left / right of the grid: generators and fans, oldest first
    const outsideEquipment = useMemo(() => [
        ...roomGenerators,
        ...fansData.filter(fan => fan.RoomID === roomId).map(fan => ({ ...fan, Type: "fan" as const })),
    ].sort((a, b) => a.ID - b.ID), [roomGenerators, fansData, roomId]);

    return {
        roomRacks,
        roomUps,
        roomPdus,
        roomConnections,
        roomPowerSources,
        roomGrid,
        roomGenerators,
        roomFaults,
        outsideEquipment,
        // All devices (not filtered, they are matched to the room's racks by RackID)
        devices,
        reloadPowerSources,
        reloadFans,
        reloadFaults,
        reloadConnections,
    };
}

// → Next in the book: 2.5.1.1 usePolling  (src/helpers/hooks/usePolling.ts)
