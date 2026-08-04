import DataList from "../DataList";
import { useMemo, useState } from "react";
import { transformData } from "../../helpers/transformData";
import { useRacks } from "../../helpers/hooks/rackOperations";
import { useRooms } from "../../helpers/hooks/roomOperations";
import DeletingOverlay from "../overlays/generics/DeletingOverlay";

type ServerRacksProps = {
    internalRoomId?: string;
};

function ServerRacks({ internalRoomId }: ServerRacksProps) {
    const { racksData, deleteRack } = useRacks();
    const { roomsData } = useRooms();

    const [rackToDelete, setRackToDelete] = useState<number | null>(null);

    const roomNumber = useMemo(() => {
        if (!internalRoomId) return undefined;

        const room = roomsData.find(
            (room) => String(room.ID) === internalRoomId
        );

        return room?.RoomNumber;
    }, [roomsData, internalRoomId]);

    const filteredData = useMemo(
        () =>
            internalRoomId
                ? racksData.filter(
                    (rack) => String(rack.RoomID) === internalRoomId
                )
                : racksData,
        [racksData, internalRoomId]
    );

    // using helper function for raw data update
    const displayData = useMemo(
        () =>
            transformData(filteredData, {
                omit: ["RoomID"],
                rename: {
                    RoomNumber: "pages.racks.data.room",
                    UnitsSize: "pages.racks.data.size (u)",
                    HeightCm: "pages.racks.data.height (cm)",
                },
            }),
        [filteredData]
    );

    return (
        <>
            {/*showing overlay only when state has id to delete*/}
            {rackToDelete !== null && (
                <DeletingOverlay
                    onCancel={() => setRackToDelete(null)}
                    onConfirm={() => {
                        deleteRack(rackToDelete);
                        setRackToDelete(null);
                    }}
                />
            )}

            {/*passing updated data as prop*/}
            {internalRoomId && (
                <h1 className="font-mono font-bold text-xl m:text-2xl l:text-3xl xl:text-4xl">
                    Room {roomNumber}
                </h1>
            )}

            <DataList
                data={displayData}
                detailPath="/racks"
                detailLabel="pages.racks.button"
                onDelete={(id: number) => setRackToDelete(id)}
            />
        </>
    );
}

export default ServerRacks;