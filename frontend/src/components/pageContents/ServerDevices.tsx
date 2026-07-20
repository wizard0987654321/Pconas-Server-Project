import DataList from "../DataList";
import { useMemo, useState } from "react";
import { transformData } from "../../helpers/transformData";
import { useDevice } from "../../helpers/hooks/deviceOperations";
import DeletingOverlay from "../overlays/DeletingOverlay";

function ServerDevices() {

    const { deviceData, deleteDevice } = useDevice();

    const [deviceToDelete, setDeviceToDelete] = useState<number | null>(null);

    const displayData = useMemo(
        () =>
            transformData(deviceData, {
                omit: ["TypeID", "Manufacturer", "Usage"],
                rename: {
                    TypeID: "pages.devices.data.type",
                    RackID: "pages.devices.data.rack",
                    InternalID: "pages.devices.data.internal id",
                    PositionFrom: "pages.devices.data.from",
                    PositionTo: "pages.devices.data.to",
                    ElectricityConnected: "pages.devices.data.electricity",
                    TORConnected: "pages.devices.data.tor connected",
                },
            }),
        [deviceData]
    );

    return (
        <>
        {deviceToDelete !== null && (
                <DeletingOverlay
                    onCancel={() => setDeviceToDelete(null)}
                    onConfirm={() => {
                        deleteDevice(deviceToDelete);
                        setDeviceToDelete(null);
                    }}
                />
            )}
            <DataList data={displayData} 
            onDelete={(id: number) => setDeviceToDelete(id)} />
        </>
    );
}

export default ServerDevices;