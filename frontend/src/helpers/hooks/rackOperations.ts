import { useData } from "./dataOperations";
import { getRackData, deleteRack } from "../../services/api";
import type { Rack } from "../../types/index.ts"


export function useRacks() {
    const {
        data: racksData,
        loading,
        remove: deleteRackById,
    } = useData<Rack>({
        getData: getRackData,
        deleteData: deleteRack,
        getId: rack => rack.ID,
    });

    return {
        racksData,
        loading,
        deleteRack: deleteRackById,
    };
}