import { useData } from "./dataOperations";
import { getRoomData, deleteRoom } from "../../services/api";
import type { Room } from "../../types/index.ts"

export function useRooms() {
    const {
        data: roomsData,
        loading,
        remove: deleteRoomById,
    } = useData<Room>({
        getData: getRoomData,
        deleteData: deleteRoom,
        getId: room => room.ID,
    });

    return {
        roomsData,
        loading,
        deleteRoom: deleteRoomById,
    };
}