/* ==========================================================================
 * BOOK THREAD A.10.3  deviceTypeOperations   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/helpers/hooks/deviceTypeOperations.ts
 *
 * useDeviceTypes: device types table data + delete.
 *
 * HOOK - only provides data / functions to the component that calls it, renders no HTML.
 *
 * Used by: 2.6.1 AddDeviceOverlay, 2.6.2 EditDeviceOverlay, 4.1 ServerDeviceTypes
 * Uses: A.10 dataOperations, A.12 api/index, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useData } from "./dataOperations"; // A.10 dataOperations
import { getDeviceTypesData, deleteDeviceType } from "../../services/api"; // A.12 api/index
import type { DeviceType } from "../../types/index.ts" // A.13 types


export function useDeviceTypes() {
    const {
        data: deviceTypesData,
        loading,
        remove: deleteDeviceTypeById,
    } = useData<DeviceType>({
        getData: getDeviceTypesData,
        deleteData: deleteDeviceType,
        getId: (deviceType) => deviceType.ID,
    });

    return {
        deviceTypesData,
        loading,
        deleteDeviceType: deleteDeviceTypeById,
    };
}

// → Next in the book: A.10.4 deviceOperations  (src/helpers/hooks/deviceOperations.ts)
