import DataList from "../DataList";
import { useState, useMemo } from "react";
import { transformData } from "../../helpers/transformData";
import { useRooms } from "../../helpers/hooks/roomOperations";
import DeletingOverlay from "../overlays/DeletingOverlay";

function ServerRoomList() {

    const { roomsData, deleteRoom } = useRooms();

    const [roomToDelete, setRoomToDelete] = useState<number | null>(null);

    const displayData = useMemo(
        () =>
            transformData(roomsData, {
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
            {roomToDelete !== null && (
                <DeletingOverlay
                    onCancel={() => setRoomToDelete(null)}
                    onConfirm={() => {
                        deleteRoom(roomToDelete);
                        setRoomToDelete(null);
                    }}
                />
            )}

            <DataList
                data={displayData}
                onDelete={(id: number) => setRoomToDelete(id)}
            />
        </>
    );
}

export default ServerRoomList;