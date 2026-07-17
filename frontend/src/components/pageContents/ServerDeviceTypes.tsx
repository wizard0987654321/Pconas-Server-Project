import DataList from "../DataList";
import { useEffect, useState, useMemo } from "react";
import { getDeviceTypesData } from "../../services/api";
import type { DeviceType } from "../../types";
import { transformData } from "../../helpers/transformData";

function ServerDeviceTypes() {

    const [deviceTypesData, setDeviceTypesData] = useState<DeviceType[]>([]);

    useEffect(() => {
        getDeviceTypesData()
            .then((data) => {
                setDeviceTypesData(data);
            })
            .catch((err) => {
                console.error("API error", err);
            });
    }, []);

    const displayData = useMemo(
        () =>
            transformData(deviceTypesData, {
                rename: {
                    TypeName: "pages.deviceTypes.data.typeName",
                    Manufacturer: "pages.deviceTypes.data.manufacturer",
                    Usage: "pages.deviceTypes.data.usage"
                },
            }),
        [deviceTypesData]
    );

    return (
        <>
            <DataList data={displayData} />
        </>
    );
}

export default ServerDeviceTypes;