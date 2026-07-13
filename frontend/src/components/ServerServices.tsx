import DataList from "./DataList";
import { useEffect, useState, useMemo } from "react";
import { getServicesData } from "../services/api";
import type { Service } from "../types";
import { transformData } from "../helpers/transformData";

function ServerServices() {

    const [servicesData, setServicesData] = useState<Service[]>([]);

    useEffect(() => {
        getServicesData()
            .then((data) => {
                setServicesData(data);
            })
            .catch((err) => {
                console.error("API error", err);
            });
    }, []);

    const displayData = useMemo(
        () =>
            transformData(servicesData, {
                omit: ["ID"],
                rename: {
                    CustomerID: "pages.services.data.customer",
                },
            }),
        [servicesData]
    );

    return (
        <>
            <DataList data={displayData} />
        </>
    );
}

export default ServerServices;