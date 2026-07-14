import DataList from "./DataList";
import { useEffect, useState, useMemo } from "react";
import { getRackData } from "../services/api";
import type { Rack } from "../types";
import { transformData } from "../helpers/transformData";

type ServerRacksProps = {
    roomId?: string;
};

function ServerRacks({ roomId }: ServerRacksProps) {

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

    const filteredData = useMemo(
        () =>
            roomId
                ? racksData.filter((rack) => String(rack.RoomID) === roomId)
                : racksData,
        [racksData, roomId]
    );

    const displayData = useMemo(
        () =>
            transformData(filteredData, {
                omit: ["ID"],
                rename: {
                    RoomID: "pages.racks.data.room",
                    UnitsSize: "pages.racks.data.size (u)",
                    HeightCm: "pages.racks.data.height (cm)",
                },
            }),
        [filteredData]
    );

    return (
        <>
            <DataList data={displayData} />
        </>
    );
}

export default ServerRacks;