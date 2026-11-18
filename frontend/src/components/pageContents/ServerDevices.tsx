/* ==========================================================================
 * BOOK THREAD 5.1  ServerDevices   (Chapter 5: Devices)
 * File: src/components/pageContents/ServerDevices.tsx
 *
 * Devices table (DataList) with delete.
 *
 * Used by: 5 DevicesPage
 * Uses: A.6 DataList, A.9 DeletingOverlay, A.10.4 deviceOperations, A.11 transformData
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import DataList from "../DataList"; // A.6 DataList
import { useMemo, useState } from "react";
import { transformData } from "../../helpers/transformData"; // A.11 transformData
import { useDevice } from "../../helpers/hooks/deviceOperations"; // A.10.4 deviceOperations
import DeletingOverlay from "../overlays/generics/DeletingOverlay"; // A.9 DeletingOverlay

function ServerDevices() {

    const { deviceData, deleteDevice } = useDevice();

    const [deviceToDelete, setDeviceToDelete] = useState<number | null>(null);

    // using helper function for raw data update
    const displayData = useMemo(
        () =>
            transformData(deviceData, {
                omit: ["TypeID", "Manufacturer", "Usage", "PoweredByDeviceID", "IsUps"],
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

// → Next in the book: 6 VmsPage  (src/pages/VmsPage.tsx)
