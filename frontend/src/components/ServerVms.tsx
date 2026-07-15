import DataList from "./DataList";
import { useEffect, useState, useMemo } from "react";
import { getVmsData } from "../services/api";
import type { VM } from "../types";
import { transformData } from "../helpers/transformData";

function ServerVms() {

    const [vmsData, setVmsData] = useState<VM[]>([]);

    useEffect(() => {
        getVmsData()
            .then((data) => {
                setVmsData(data);
            })
            .catch((err) => {
                console.error("API error", err);
            });
    }, []);

    const displayData = useMemo(
        () =>
            transformData(vmsData, {
                omit: ["ID", "ServiceID"],
                rename: {
                    ServiceName: "pages.vms.data.service",
                    DeviceID: "pages.vms.data.device",
                },
            }),
        [vmsData]
    );

    return (
        <>
            <DataList data={displayData} />
        </>
    );
}

export default ServerVms;