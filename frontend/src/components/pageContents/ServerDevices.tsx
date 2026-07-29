import DataList from "../DataList";
import { useMemo, useState } from "react";
import { transformData } from "../../helpers/transformData";
import { useDevice } from "../../helpers/hooks/deviceOperations";
import DeletingOverlay from "../overlays/DeletingOverlay";

function ServerDevices() {

    const { deviceData, deleteDevice } = useDevice();

    const [deviceToDelete, setDeviceToDelete] = useState<number | null>(null);

    // using helper function for raw data update
    const displayData = useMemo(
        () =>
            transformData(deviceData, {
                omit: ["TypeID", "Manufacturer", "Usage"],
                rename: {
                    TypeName: "pages.devices.data.type",
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
        {/*showing overlay only when state has id to delete*/}
        {deviceToDelete !== null && (
                <DeletingOverlay
                    onCancel={() => setDeviceToDelete(null)}
                    onConfirm={() => {
                        deleteDevice(deviceToDelete);
                        setDeviceToDelete(null);
                    }}
                />
            )}

            {/*passing updated data as prop*/}
            <DataList data={displayData} 
            onDelete={(id: number) => setDeviceToDelete(id)} />
        </>
    );
}

export default ServerDevices;