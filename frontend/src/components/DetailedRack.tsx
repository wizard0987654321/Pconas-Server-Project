import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getRackData, getDevicesData, getDeviceTypesData } from "../services/api";
import type { Rack, Device } from "../types";
import { useTranslation } from "react-i18next";
import PrimaryButton from "./buttons/PrimaryButton";
import AddDeviceOverlay from "./overlays/AddDeviceOverlay";
import { useGSAP } from "@gsap/react";
import { detailedRackAnimation } from "../animations/detailedRackAnimation";
import EditDeviceOverlay from "./overlays/EditDeviceOverlay";
import LoadingSpinner from "./LoadingSpinner";

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
                            Rack {rack.ID}
                        </div>
                    </div>

                    {/*calculating where devices should be located in the rack*/}
                    {units.map((unit) => {
                        const device = devices.find(
                            (d: Device) =>
                                unit >= d.PositionFrom &&
                                unit <= d.PositionTo
                        );

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
                                        <div className="relative group w-full hover:z-50">
                                            <div
                                                onClick={() => setSelectedDevice(device)}
                                                className={`w-full cursor-pointer rounded px-2 py-1 text-xs transition-transform duration-150 hover:scale-[1.02] ${device.ElectricityConnected
                                                    ? "bg-[#6ADBAF] text-white"
                                                    : "bg-[#6ADBAF]/30 text-white"
                                                    }`}
                                            >
                                                {device.InternalID}
                                            </div>
                                            {/* hover div */}
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
                                                <p>
                                                    <span className="font-semibold">{t("common.electricity")}:</span>{" "}
                                                    <span
                                                        className={!device.ElectricityConnected ? "font-bold text-[#FF6B6B]" : ""}
                                                    >
                                                        {device.ElectricityConnected ? t("common.yes") : t("common.no")}
                                                    </span>
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