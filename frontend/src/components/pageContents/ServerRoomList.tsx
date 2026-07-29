import DataList from "../DataList";
import { useState, useMemo } from "react";
import { transformData } from "../../helpers/transformData";
import { useRooms } from "../../helpers/hooks/roomOperations";
import DeletingOverlay from "../overlays/DeletingOverlay";

function ServerRoomList() {

    const { roomsData, deleteRoom } = useRooms();

    const [roomToDelete, setRoomToDelete] = useState<number | null>(null);

    // using helper function for raw data update
    const displayData = useMemo(
        () =>
            transformData(roomsData, {
                rename: {
                    RoomNumber: "#",
                    Area: "pages.rooms.data.area",
                    Capacity: "pages.rooms.data.capacity",
                    HeightCm: "pages.rooms.data.height (cm)",
                },
            }),
        [roomsData]
    );

    return (
        <>
            {/*showing overlay only when state has id to delete*/}
            {roomToDelete !== null && (
                <DeletingOverlay
                    onCancel={() => setRoomToDelete(null)}
                    onConfirm={() => {
                        deleteRoom(roomToDelete);
                        setRoomToDelete(null);
                    }}
                />
            )}

            {/*passing updated data as prop*/}
            <DataList
                data={displayData}
                onDelete={(id: number) => setRoomToDelete(id)}
            />
        </>
    );
}

export default ServerRoomList;