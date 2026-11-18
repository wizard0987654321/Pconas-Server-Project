/* ==========================================================================
 * BOOK THREAD 2.1  ServerRoomList   (Chapter 2: Rooms)
 * File: src/components/pageContents/ServerRoomList.tsx
 *
 * List view: rooms as a table (DataList) with delete and a button to the detailed room view (2.5).
 *
 * Used by: 2 RoomsPage
 * Uses: A.6 DataList, A.9 DeletingOverlay, A.10.1 roomOperations, A.11 transformData
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import DataList from "../DataList"; // A.6 DataList
import { useState, useMemo } from "react";
import { transformData } from "../../helpers/transformData"; // A.11 transformData
import { useRooms } from "../../helpers/hooks/roomOperations"; // A.10.1 roomOperations
import DeletingOverlay from "../overlays/generics/DeletingOverlay"; // A.9 DeletingOverlay
import { useTranslation } from "react-i18next";

function ServerRoomList() {

    const { t } = useTranslation();
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
                detailPath="/rooms"
                detailLabel={t("pages.rooms.detailedButton")}
                onDelete={(id: number) => setRoomToDelete(id)}
            />
        </>
    );
}

export default ServerRoomList;

// → Next in the book: 2.2 ServerRoom  (src/components/pageContents/ServerRoom.tsx)
