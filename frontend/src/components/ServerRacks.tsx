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
            {roomId && (<h1 className="font-mono font-bold text-xl m:text-2xl l:text-3xl xl:text-4xl">Room {roomId}</h1>)}
            <DataList data={displayData} detailPath="/racks" detailLabel={"to the rack detailed view"} />
        </>
    );
}

export default ServerRacks;