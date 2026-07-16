import { useState } from "react";

type AddRoomOverlayProps = {
    onClose: () => void;
};

function AddRoomOverlay({ onClose }: AddRoomOverlayProps) {
    const [roomName, setRoomName] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log({
            roomName,
            location,
            capacity,
        });

        //ak chajdeba api call
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-[500px] shadow-lg">
                <h2 className="text-2xl font-bold mb-6">
                    Add New Room
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <div>
                        <label className="block mb-1 font-medium">
                            Room Name
                        </label>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Location
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Capacity
                        </label>
                        <input
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="cursor-pointer px-4 py-2 bg-[#6ADBAF] rounded text-white"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRoomOverlay;