import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRackData, getDevicesData, getDeviceTypesData } from "../services/api";
import type { Rack, Device } from "../types";
import { useTranslation } from "react-i18next";
import PrimaryButton from "./buttons/PrimaryButton";
import AddDeviceOverlay from "./overlays/AddDeviceOverlay";

function DetailedRack() {
    const { id } = useParams();
    const { t } = useTranslation();

    const [selectedRackId, setSelectedRackId] = useState<number | null>(null);
    const [deviceTypes, setDeviceTypes] = useState<any[]>([]);

    const handleDeviceAdded = (rackId: number) => {
        setSelectedRackId(rackId);
    };

    const [rack, setRack] = useState<Rack | null>(null);
    const [devices, setDevices] = useState<Device[]>([]);
    const [loadingRack, setLoadingRack] = useState(true);
    const [loadingDevices, setLoadingDevices] = useState(true);

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
        return <p>{t("common.loading")}</p>;
    }

    if (!rack) {
        return <p>{t("common.notFound")}</p>;
    }

    const units = Array.from(
        { length: rack.UnitsSize },
        (_, i) => rack.UnitsSize - i
    );

    return (
        <>
            {selectedRackId !== null && (
                <AddDeviceOverlay
                    onClose={() => setSelectedRackId(null)} rackId={selectedRackId}
                />
            )}

            <div className="w-full h-full flex flex-col items-center">
                <div className="w-[100%] flex flex-start">
                    <PrimaryButton
                        label={t("pages.devices.addButton")}
                        onClick={() => handleDeviceAdded(rack.ID)}
                        margin="m-6"
                    />
                </div>
                <div className="my-4 w-[80%] xs:w-[70%] l:w-[40%] border-4 border-gray-700 rounded overflow-hidden">

                    <div className="bg-gray-800 text-white text-center py-2 font-bold">
                        Rack {rack.ID}
                    </div>

                    {units.map((unit) => {
                        const device = devices.find(
                            (d: Device) =>
                                unit >= d.PositionFrom &&
                                unit <= d.PositionTo
                        );

                        return (
                            <div
                                key={unit}
                                className="flex h-8 border-b border-gray-300"
                            >
                                <div className="w-10 flex items-center justify-center bg-gray-100 border-r text-xs font-semibold">
                                    {unit}
                                </div>

                                <div className="flex-1 flex items-center px-2">
                                    {device ? (
                                        <div className="relative group w-full">
                                            <div className="w-full cursor-pointer rounded bg-blue-600 px-2 py-1 text-xs text-white transition-transform duration-150 hover:scale-[1.02]">
                                                {device.InternalID}
                                            </div>

                                            <div className="absolute left-1/2 top-full z-20 mt-2 hidden w-52 -translate-x-1/2 rounded-md border-2 border-[#6ADBAF] bg-white p-3 font-mono text-xs text-black shadow-lg group-hover:block">
                                                <p><span className="font-semibold">Internal ID:</span> {device.InternalID}</p>
                                                <p>
                                                    <span className="font-semibold">Type:</span>{" "}
                                                    {
                                                        deviceTypes.find(
                                                            type => type.ID === device.TypeID
                                                        )?.TypeName ?? "Unknown"
                                                    }
                                                </p>                                                <p><span className="font-semibold">Position:</span> {device.PositionFrom}U - {device.PositionTo}U</p>
                                                <p><span className="font-semibold">Electricity:</span> {device.ElectricityConnected ? "Yes" : "No"}</p>
                                                <p><span className="font-semibold">TOR:</span> {device.TORConnected ? "Yes" : "No"}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-5 rounded border border-dashed border-gray-300"></div>
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