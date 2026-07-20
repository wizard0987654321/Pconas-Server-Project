import { useState, useEffect } from "react";
import { getRoomData } from "../../services/api";
const API_URL = import.meta.env.VITE_API_URL;

type AddRackOverlayProps = {
    onClose: () => void;
};

function AddRackOverlay({ onClose }: AddRackOverlayProps) {
    const [roomId, setRoomId] = useState("");
    const [unitsSize, setUnitsSize] = useState("");
    const [height, setHeight] = useState("");
    const [rooms, setRooms] = useState<any[]>([]);

    useEffect(() => {
    const loadRooms = async () => {
        try {
            const data = await getRoomData();
            setRooms(data);
        } catch (error) {
            console.error("Failed loading rooms:", error);
        }
    };

    loadRooms();
}, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log({
            roomId,
            unitsSize,
            height,
        });

        const newRack = {
            roomId,
            unitsSize,
            heightcm: height,
        };

        try {
            const response = await fetch(`${API_URL}/addRack`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newRack }),
            });

            if (!response.ok) {
                throw new Error("Failed to add rack");
            }

            const data = await response.json();
            console.log(data);
            window.location.reload();

            onClose(); // Close the overlay after success
        } catch (error) {
            console.error("Error adding rack:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-lg s:w-[500px] s:max-w-none s:p-6">
                <h2 className="mb-4 text-xl font-bold s:mb-6 s:text-2xl">
                    Add New Rack
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 s:gap-4"
                >
                    <div>
                        <label className="mb-1 block font-medium">
                            Room ID
                        </label>
                        <select
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="w-full rounded border p-2"
                            required
                        >
                            <option value="">Select a room</option>

                            {rooms.map((room, index) => (
                                <option key={room.ID} value={room.ID}>
                                    Room {index + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Size in units (U)
                        </label>
                        <input
                            type="number"
                            value={unitsSize}
                            onChange={(e) => setUnitsSize(e.target.value)}
                            className="w-full rounded border p-2"
                            min="1"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Height (cm)
                        </label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full rounded border p-2"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="mt-3 flex justify-end gap-2 s:mt-4 s:gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded border px-3 py-2 s:px-4"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="cursor-pointer rounded bg-[#6ADBAF] px-3 py-2 text-white s:px-4"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRackOverlay;