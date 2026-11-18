/* ==========================================================================
 * BOOK THREAD A.10.1  roomOperations   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/helpers/hooks/roomOperations.ts
 *
 * useRooms: rooms table data + delete.
 *
 * HOOK - only provides data / functions to the component that calls it, renders no HTML.
 *
 * Used by: 2.1 ServerRoomList, 2.2 ServerRoom, 2.2.1 AddRackOverlay, 2.5 DetailedRoom,
 *   2.5.9 AddEquipmentOverlay, 3.1 ServerRacks
 * Uses: A.10 dataOperations, A.12 api/index, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useData } from "./dataOperations"; // A.10 dataOperations
import { getRoomData, deleteRoom } from "../../services/api"; // A.12 api/index
import type { Room } from "../../types/index.ts" // A.13 types

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

// → Next in the book: A.10.2 rackOperations  (src/helpers/hooks/rackOperations.ts)
