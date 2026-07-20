import DataList from "../DataList";
import { useMemo, useState } from "react";
import { transformData } from "../../helpers/transformData";
import { useDeviceTypes } from "../../helpers/hooks/deviceTypeOperations";
import DeletingOverlay from "../overlays/DeletingOverlay";

function ServerDeviceTypes() {
    const { deviceTypesData, deleteDeviceType } = useDeviceTypes();

    const [deviceTypeToDelete, setDeviceTypeToDelete] = useState<number | null>(null);

    const displayData = useMemo(
        () =>
            transformData(deviceTypesData, {
                rename: {
                    TypeName: "pages.deviceTypes.data.typeName",
                    Manufacturer: "pages.deviceTypes.data.manufacturer",
                    Usage: "pages.deviceTypes.data.usage",
                },
            }),
        [deviceTypesData]
    );

    return (
        <>
            {deviceTypeToDelete !== null && (
                <DeletingOverlay
                    onCancel={() => setDeviceTypeToDelete(null)}
                    onConfirm={() => {
                        deleteDeviceType(deviceTypeToDelete);
                        setDeviceTypeToDelete(null);
                    }}
                />
            )}

            <DataList
                data={displayData}
                onDelete={(id: number) => setDeviceTypeToDelete(id)}
            />
        </>
    );
}

export default ServerDeviceTypes;