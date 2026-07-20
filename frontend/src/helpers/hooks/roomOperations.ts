import { useEffect, useState } from "react";
import type { Room } from "../../types";
import { getRoomData, deleteRoom as deleteRoomApi } from "../../services/api";

export function useRooms() {
    const [roomsData, setRoomsData] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRoomData()
            .then(setRoomsData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const deleteRoom = async (id: number) => {
        try {
            await deleteRoomApi(id);

            setRoomsData(prev =>
                prev.filter(room => room.ID !== id)
            );
        } catch (err) {
            console.error(err);
        }
    };

    return { roomsData, loading, deleteRoom };
}