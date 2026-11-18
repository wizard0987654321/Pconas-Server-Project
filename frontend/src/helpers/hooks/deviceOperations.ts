/* ==========================================================================
 * BOOK THREAD A.10.4  deviceOperations   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/helpers/hooks/deviceOperations.ts
 *
 * useDevice: devices table data + delete.
 *
 * HOOK - only provides data / functions to the component that calls it, renders no HTML.
 *
 * Used by: 2.6.1 AddDeviceOverlay, 2.6.2 EditDeviceOverlay, 5.1 ServerDevices, 6.2 AddVmOverlay
 * Uses: A.10 dataOperations, A.12 api/index, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useData } from "./dataOperations"; // A.10 dataOperations
import { getDevicesData, deleteDevice} from "../../services/api"; // A.12 api/index
import type { Device } from "../../types/index.ts" // A.13 types


export function useDevice() {
    const {
        data: deviceData,
        loading,
        remove: deleteDeviceById,
    } = useData<Device>({
        getData: getDevicesData,
        deleteData: deleteDevice,
        getId: (device) => device.ID,
    });

    return {
        deviceData,
        loading,
        deleteDevice: deleteDeviceById,
    };
}

// → Next in the book: A.10.5 vmOperations  (src/helpers/hooks/vmOperations.ts)
