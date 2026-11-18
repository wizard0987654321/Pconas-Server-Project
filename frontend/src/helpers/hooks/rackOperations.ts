/* ==========================================================================
 * BOOK THREAD A.10.2  rackOperations   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/helpers/hooks/rackOperations.ts
 *
 * useRacks: racks table data + delete.
 *
 * HOOK - only provides data / functions to the component that calls it, renders no HTML.
 *
 * Used by: 2.6.1 AddDeviceOverlay, 2.6.2 EditDeviceOverlay, 3.1 ServerRacks
 * Uses: A.10 dataOperations, A.12 api/index, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useData } from "./dataOperations"; // A.10 dataOperations
import { getRackData, deleteRack } from "../../services/api"; // A.12 api/index
import type { Rack } from "../../types/index.ts" // A.13 types


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

// → Next in the book: A.10.3 deviceTypeOperations  (src/helpers/hooks/deviceTypeOperations.ts)
