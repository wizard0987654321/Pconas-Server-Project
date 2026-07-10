import DataList from "./DataList";
import { useEffect, useState } from "react";
import { getRoomData } from "../services/api";
import type { Rack } from "../types";

function ServerRoomList() {

const [racksData, setRacksData] = useState<Rack[]>([]);

    useEffect(() => {
            getRoomData()
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

export default ServerRoomList;