import DataList from "./DataList";
import { useEffect, useState } from "react";
import { getRackData } from "../services/api";
import type { Rack } from "../types";

function ServerRacks() {

const [racksData, setRacksData] = useState<Rack[]>([]);

    useEffect(() => {
            getRackData()
                .then((data) => {
                    console.log("API Response is sqlistvis rackdata:", data);
                    setRacksData(data);
                })
                .catch((err) => {
                    console.error("API error", err);
                });
        }, []);

    return (
        <>
            <DataList data={racksData} />
        </>
    )
}

export default ServerRacks;