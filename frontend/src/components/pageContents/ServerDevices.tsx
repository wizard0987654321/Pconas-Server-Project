import DataList from "../DataList";
import { useEffect, useState, useMemo } from "react";
import { getDevicesData } from "../../services/api";
import type { Device } from "../../types";
import { transformData } from "../../helpers/transformData";

function ServerDevices() {

    const [devicesData, setDevicesData] = useState<Device[]>([]);

    useEffect(() => {
        getDevicesData()
            .then((data) => {
                setDevicesData(data);
            })
            .catch((err) => {
                console.error("API error", err);
            });
    }, []);

    const displayData = useMemo(
        () =>
            transformData(devicesData, {
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
        [devicesData]
    );

    return (
        <>
            <DataList data={displayData} />
        </>
    );
}

export default ServerDevices;