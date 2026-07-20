import { useEffect, useState } from "react";
import { getRackData, deleteRack as deleteRackApi } from "../../services/api";
import type { Rack } from "../../types";

export function useRacks() {
    const [racksData, setRacksData] = useState<Rack[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRackData()
            .then(setRacksData)
            .catch((err) => console.error("API error:", err))
            .finally(() => setLoading(false));
    }, []);

    const deleteRack = async (id: number) => {
        try {
            await deleteRackApi(id);

            setRacksData(prev =>
                prev.filter(rack => rack.ID !== id)
            );
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    return {
        racksData,
        deleteRack,
        loading,
    };
}