import DataList from "./DataList";
import { useEffect, useState } from "react";
import { getServicesData } from "../services/api";
import type { Service } from "../types";

function ServerServices() {

const [servicesData, setServicesData] = useState<Service[]>([]);

    useEffect(() => {
            getServicesData()
                .then((data) => {
                    console.log("API Response is sqlistvis Services data:", data);
                    setServicesData(data);
                })
                .catch((err) => {
                    console.error("API error", err);
                });
        }, []);

    return (
        <>
            <DataList data={servicesData} />
        </>
    )
}

export default ServerServices;