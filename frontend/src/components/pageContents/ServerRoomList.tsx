import DataList from "../DataList";
import { useEffect, useState, useMemo } from "react";
import { getRoomData } from "../../services/api";
import type { Room } from "../../types";
import { transformData } from "../../helpers/transformData";

function ServerRoomList() {

    const [roomsData, setRoomsData] = useState<Room[]>([]);

    useEffect(() => {
        getRoomData()
            .then((data) => {
                setRoomsData(data);
            })
            .catch((err) => {
                console.error("API error", err);
            });
    }, []);

    const displayData = useMemo(
        () =>
            transformData(roomsData, {
                omit: ["ID"],
                rename: {
                    Area: "pages.rooms.data.area",
                    Capacity: "pages.rooms.data.capacity",
                    HeightCm: "pages.rooms.data.height (cm)",
                },
            }),
        [roomsData]
    );

    return (
        <>
            <DataList data={displayData} />
        </>
    );
}

export default ServerRoomList;