/* ==========================================================================
 * BOOK THREAD 2.6  DetailedRack   (Chapter 2: Rooms)
 * File: src/components/detailedViews/DetailedRack.tsx
 *
 * One rack with its height units (U) and devices. Color and hover of each device show where its electricity
 * comes from (room power flow 2.5.2 + in-rack UPS 2.5.3.1).
 *
 * Reached via: URL /racks/:id  (rack click in 2.2 ServerRoom and 2.5 DetailedRoom, detail button in 3.1 ServerRacks)
 * Used by: 0.5 routes
 * Uses: 2.5.1 useRoomData, 2.5.2 usePowerFlow, 2.5.3.1 inRackUps, 2.5.5 useEquipmentLabels,
 *   2.5.7 powerStyles, 2.6.1 AddDeviceOverlay, 2.6.2 EditDeviceOverlay, A.2 PrimaryButton,
 *   A.5 LoadingSpinner, A.12 api/index, A.13 types, A.14.5 detailedRackAnimation
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getRackData, getDevicesData, getDeviceTypesData } from "../../services/api"; // A.12 api/index
import type { Rack, Device } from "../../types"; // A.13 types
import { useTranslation } from "react-i18next";
import PrimaryButton from "../buttons/PrimaryButton"; // A.2 PrimaryButton
import AddDeviceOverlay from "../overlays/AddDeviceOverlay"; // 2.6.1 AddDeviceOverlay
import { useGSAP } from "@gsap/react";
import { detailedRackAnimation } from "../../animations/detailedRackAnimation"; // A.14.5 detailedRackAnimation
import EditDeviceOverlay from "../overlays/EditDeviceOverlay"; // 2.6.2 EditDeviceOverlay
import LoadingSpinner from "../LoadingSpinner"; // A.5 LoadingSpinner
import { POWER_STATE_TEXT_CLASS, powerStateKey } from "../powerSimulation/powerStyles"; // 2.5.7 powerStyles
import { useRoomData } from "../../helpers/hooks/useRoomData"; // 2.5.1 useRoomData
import { usePowerFlow } from "../../helpers/hooks/usePowerFlow"; // 2.5.2 usePowerFlow
import { useEquipmentLabels } from "../../helpers/hooks/useEquipmentLabels"; // 2.5.5 useEquipmentLabels
import { devicePowerState } from "../../helpers/inRackUps"; // 2.5.3.1 inRackUps

//detailed view for rack, can be opened with "to the rack detailed view" button
function DetailedRack() {
    const { id } = useParams();
    const { t } = useTranslation();

    const [selectedRackId, setSelectedRackId] = useState<number | null>(null);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [deviceTypes, setDeviceTypes] = useState<any[]>([]);

    const handleDeviceAdded = (rackId: number) => {
        setSelectedRackId(rackId);
    };

    const [rack, setRack] = useState<Rack | null>(null);
    const [devices, setDevices] = useState<Device[]>([]);
    const [loadingRack, setLoadingRack] = useState(true);
    const [loadingDevices, setLoadingDevices] = useState(true);

    // Power state of this rack from its room's power flow (polled, so trainer faults show up live)
    const {
        roomRacks, roomUps, roomPdus, roomConnections, roomPowerSources, roomGrid, roomGenerators, roomFaults,
    } = useRoomData(rack?.RoomID ?? 0); // 2.5.1 useRoomData
    const { powerStateOf } = usePowerFlow({ // 2.5.2 usePowerFlow
        powerSources: roomPowerSources,
        ups: roomUps,
        pdus: roomPdus,
        racks: roomRacks,
        connections: roomConnections,
        faults: roomFaults,
    });
    // Until the room's data is loaded (every room has a grid), treat the rack as powered, so nothing flashes grey
    const rackState = rack && roomGrid ? powerStateOf(rack.ID) : "powered";

    // What feeds the rack: the equipment with a cable into it (e.g. "PDU 1, PDU 2")
    const equipmentLabel = useEquipmentLabels({ // 2.5.5 useEquipmentLabels
        grid: roomGrid, generators: roomGenerators, racks: roomRacks, ups: roomUps, pdus: roomPdus,
    });
    const rackFeeders = roomConnections
        .filter(connection => connection.ToEquipmentID === rack?.ID)
        .map(connection => equipmentLabel(connection.FromEquipmentID));

    //GSAP animation for rack
    const rackRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!rackRef.current) return;

        detailedRackAnimation(rackRef.current);
    }, {
        scope: rackRef,
        dependencies: [devices, rack],
    });

    //getting rack, device types and devices data so that device can be displayed inside racks
    useEffect(() => {
        getRackData()
            .then((data: Rack[]) => {
                const match = data.find((r) => String(r.ID) === id);
                setRack(match ?? null);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoadingRack(false));
    }, [id]);

    useEffect(() => {
        getDevicesData()
            .then((data: Device[]) => {
                const rackDevices = data.filter(
                    (d) => String(d.RackID) === id
                );
                setDevices(rackDevices);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoadingDevices(false));
    }, [id]);

    useEffect(() => {
        getDeviceTypesData()
            .then((data) => {
                setDeviceTypes(data);
            })
            .catch((err) => console.error(err));
    }, []);

    if (loadingRack || loadingDevices) {
        return <LoadingSpinner />;
    }

    if (!rack) {
        return <p>{t("common.notFound")}</p>;
    }

    // calculating total size of units
    const units = Array.from(
        { length: rack.UnitsSize },
        (_, i) => rack.UnitsSize - i
    );

    return (
        <>
            {/*overlay for adding new device*/}
            {selectedRackId !== null && (
                <AddDeviceOverlay
                    onClose={() => setSelectedRackId(null)} rackId={selectedRackId}
                />
            )}

            {/*overlay for editing existing device*/}
            {selectedDevice && (
                <EditDeviceOverlay
                    device={selectedDevice}
                    onClose={() => setSelectedDevice(null)}
                />
            )}

            <div className="w-full h-full flex flex-col items-center text-[#111827] dark:text-[#F9FAFB]">
                <div className="w-[100%] flex flex-start">
                    <PrimaryButton
                        label={t("pages.devices.addButton")}
                        onClick={() => handleDeviceAdded(rack.ID)}
                        margin="m-6"
                    />
                </div>
                <div
                    ref={rackRef}
                    className="relative my-4 w-[80%] xs:w-[70%] l:w-[40%] border-4 border-[#6ADBAF] rounded bg-[#F8FAFC] dark:bg-[#0F234F]"
                >
                    <div className="overflow-hidden rounded-t">
                        <div className="bg-[#0E1F48] text-[#F9FAFB] text-center py-2 font-bold">
                            Rack {rack.RackNumber}
                        </div>
                    </div>

                    {/*calculating where devices should be located in the rack*/}
                    {units.map((unit) => {
                        const device = devices.find(
                            (d: Device) =>
                                unit >= d.PositionFrom &&
                                unit <= d.PositionTo
                        );
                        const deviceState = device ? devicePowerState(device, rackState, devices) : "unpowered"; // 2.5.3.1 devicePowerState
                        const poweredByUps = device?.PoweredByDeviceID != null
                            ? devices.find(d => d.ID === device.PoweredByDeviceID)
                            : undefined;

                        // "Electricity" hover line: where the device is plugged in (in-rack UPS or the rack's PDU / UPS)
                        const electricitySource = !device?.ElectricityConnected
                            ? t("pages.devices.form.notConnected")
                            : poweredByUps
                                ? `${poweredByUps.TypeName} (${poweredByUps.InternalID})`
                                : rackFeeders.length > 0
                                    ? rackFeeders.join(", ")
                                    : t("pages.devices.form.noRackCable");

                        return (
                            <div
                                key={unit}
                                className="rack-unit-row flex h-8 border-b border-[#6ADBAF]/40"
                            >
                                <div className="w-10 flex items-center justify-center bg-[#EAF9F2] border-r border-[#6ADBAF]/40 text-xs font-semibold dark:bg-[#12315f]">
                                    {unit}
                                </div>

                                <div className="flex-1 flex items-center px-2">
                                    {device ? (
                                        <div className={`relative group w-full ${!selectedDevice ? "hover:z-50" : ""}`}>
                                            <div
                                                onClick={() => setSelectedDevice(device)}
                                                // not plugged in: faded, plugged in but no power (rack down, no UPS): grey, otherwise green
                                                className={`w-full cursor-pointer rounded px-2 py-1 text-xs transition-transform duration-150 hover:scale-[1.02] ${!device.ElectricityConnected && !device.IsUps
                                                    ? "bg-[#6ADBAF]/30 text-white"
                                                    : deviceState === "unpowered"
                                                        ? "bg-gray-400 text-white"
                                                        : "bg-[#6ADBAF] text-white"
                                                    }`}
                                            >
                                                {device.InternalID}
                                            </div>
                                            {/* hover div */}
                                            {!selectedDevice && (
                                                <div className="absolute left-1/2 top-full z-40 mt-2 hidden w-52 -translate-x-1/2 rounded-md border-2 border-[#6ADBAF] bg-[#F8FAFC] p-3 font-mono text-xs text-[#111827] shadow-lg group-hover:block dark:bg-[#0E1F48] dark:text-[#F9FAFB]">
                                                    <p><span className="font-semibold">{t("common.internalId")}:</span> {device.InternalID}</p>
                                                    <p>
                                                        {/*displaying device name instead of foreign id foreign key*/}
                                                        <span className="font-semibold">{t("common.type")}:</span>{" "}
                                                        {
                                                            deviceTypes.find(
                                                                type => type.ID === device.TypeID
                                                            )?.TypeName ?? t("common.unknown")
                                                        }
                                                    </p>
                                                    <p><span className="font-semibold">{t("common.position")}:</span> {device.PositionFrom}U - {device.PositionTo}U</p>
                                                    {/* Electricity: source + whether power really arrives there (an in-rack UPS always shows its state) */}
                                                    <p>
                                                        <span className="font-semibold">{t("common.electricity")}:</span>{" "}
                                                        <span className={!device.ElectricityConnected ? "font-bold text-[#FF6B6B]" : ""}>
                                                            {electricitySource}
                                                        </span>
                                                        {(device.ElectricityConnected || device.IsUps) && (
                                                            <span className={`font-semibold ${POWER_STATE_TEXT_CLASS[deviceState]}`}>
                                                                {" · "}{t(powerStateKey(deviceState))}
                                                            </span>
                                                        )}
                                                    </p>

                                                    <p>
                                                        <span className="font-semibold">{t("common.tor")}:</span>{" "}
                                                        <span
                                                            className={!device.TORConnected ? "font-bold text-[#FF6B6B]" : ""}
                                                        >
                                                            {device.TORConnected ? t("common.yes") : t("common.no")}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full h-5 rounded border border-dashed border-[#6ADBAF]/40"></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default DetailedRack;

// → Next in the book: 2.6.1 AddDeviceOverlay  (src/components/overlays/AddDeviceOverlay.tsx)
