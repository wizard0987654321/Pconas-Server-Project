import DataList from "./DataList";
import { useEffect, useState } from "react";
import { getVmsData } from "../services/api";
import type { VM } from "../types";

function ServerVms() {

const [vmsData, setVmsData] = useState<VM[]>([]);

    useEffect(() => {
            getVmsData()
                .then((data) => {
                    console.log("API Response is sqlistvis Devicedata:", data);
                    setVmsData(data);
                })
                .catch((err) => {
                    console.error("API error", err);
                });
        }, []);

    return (
        <>
            <DataList data={vmsData} />
        </>
    )
}

export default ServerVms;