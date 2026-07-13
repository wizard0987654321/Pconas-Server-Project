import DataList from "./DataList";
import { useEffect, useState, useMemo } from "react";
import { getRoomData } from "../services/api";
import type { Room } from "../types";

function ServerRoomList() {

    const [roomsData, setRoomsData] = useState<Room[]>([]);

    useEffect(() => {
        getRoomData()
            .then((data) => {
                console.log("API Response is sqlistvis rackdata:", data);
                setRoomsData(data);
            })
            .catch((err) => {
                console.error("API error", err);
            });
    }, []);


    const displayData = useMemo(
        () =>
            roomsData.map(({ HeightCm, ...rest }) => ({
                ...rest,
                "Height (CM)": HeightCm
            })),
        [roomsData]
    );

    return (
        <>
            <DataList data={displayData} />
        </>
    )
}

export default ServerRoomList;