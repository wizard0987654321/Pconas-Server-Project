import DataList from "./DataList";
import { useEffect, useState, useMemo } from "react";
import { getRackData } from "../services/api";
import type { Rack } from "../types";
import { transformData } from "../helpers/transformData";

function ServerRacks() {

    const [racksData, setRacksData] = useState<Rack[]>([]);

    useEffect(() => {
        getRackData()
            .then((data) => {
                setRacksData(data);
            })
            .catch((err) => {
                console.error("API error", err);
            });
    }, []);

    const displayData = useMemo(
        () =>
            transformData(racksData, {
                omit: ["ID"],
                rename: {
                    RoomID: "pages.racks.data.room",
                    UnitsSize: "pages.racks.data.size (u)",
                    HeightCm: "pages.racks.data.height (cm)",
                },
            }),
        [racksData]
    );

    return (
        <>
            <DataList data={displayData} />
        </>
    );
}

export default ServerRacks;