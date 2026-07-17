import { useEffect, useState } from "react";
import { getRoomData } from "../../services/api";
import type { Room } from "../../types";

const API_URL = import.meta.env.VITE_API_URL;

export function useRooms() {
    const [roomsData, setRoomsData] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRoomData()
            .then((data) => {
                setRoomsData(data);
            })
            .catch((err) => {
                console.error("API error:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const deleteRoom = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/deleteRoom/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete room");
            }

            await response.json();

            setRoomsData((prevRooms) =>
                prevRooms.filter((room) => room.ID !== id)
            );

        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return {
        roomsData,
        deleteRoom,
        loading,
    };
}