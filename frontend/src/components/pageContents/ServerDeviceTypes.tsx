/* ==========================================================================
 * BOOK THREAD 4.1  ServerDeviceTypes   (Chapter 4: Device Types)
 * File: src/components/pageContents/ServerDeviceTypes.tsx
 *
 * Device types table (DataList) with delete.
 *
 * Used by: 4 DeviceTypesPage
 * Uses: A.6 DataList, A.9 DeletingOverlay, A.10.3 deviceTypeOperations, A.11 transformData
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import DataList from "../DataList"; // A.6 DataList
import { useMemo, useState } from "react";
import { transformData } from "../../helpers/transformData"; // A.11 transformData
import { useDeviceTypes } from "../../helpers/hooks/deviceTypeOperations"; // A.10.3 deviceTypeOperations
import DeletingOverlay from "../overlays/generics/DeletingOverlay"; // A.9 DeletingOverlay

function ServerDeviceTypes() {
    const { deviceTypesData, deleteDeviceType } = useDeviceTypes();

    const [deviceTypeToDelete, setDeviceTypeToDelete] = useState<number | null>(null);

    // using helper function for raw data update
    const displayData = useMemo(
        () =>
            transformData(deviceTypesData, {
                rename: {
                    TypeName: "pages.deviceTypes.data.typeName",
                    Manufacturer: "pages.deviceTypes.data.manufacturer",
                    Usage: "pages.deviceTypes.data.usage",
                    IsUps: "pages.deviceTypes.data.isUps",
                },
            }),
        [deviceTypesData]
    );

    return (
        <>
            {/*showing overlay only when state has id to delete*/}
            {deviceTypeToDelete !== null && (
                <DeletingOverlay
                    onCancel={() => setDeviceTypeToDelete(null)}
                    onConfirm={() => {
                        deleteDeviceType(deviceTypeToDelete);
                        setDeviceTypeToDelete(null);
                    }}
                />
            )}

            {/*passing updated data as prop*/}
            <DataList
                data={displayData}
                onDelete={(id: number) => setDeviceTypeToDelete(id)}
            />
        </>
    );
}

export default ServerDeviceTypes;

// → Next in the book: 4.2 AddDeviceTypeOverlay  (src/components/overlays/AddDeviceTypeOverlay.tsx)
