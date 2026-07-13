import DataList from "./DataList";
import { useEffect, useState } from "react";
import { getDevicesData } from "../services/api";
import type { Device } from "../types";

function ServerDevices() {

const [devicesData, setDevicesData] = useState<Device[]>([]);

    useEffect(() => {
            getDevicesData()
                .then((data) => {
                    console.log("API Response is sqlistvis Devicedata:", data);
                    setDevicesData(data);
                })
                .catch((err) => {
                    console.error("API error", err);
                });
        }, []);

    return (
        <>
            <DataList data={devicesData} />
        </>
    )
}

export default ServerDevices;