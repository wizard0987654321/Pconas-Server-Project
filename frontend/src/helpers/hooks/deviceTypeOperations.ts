import { useData } from "./dataOperations";
import { getDeviceTypesData, deleteDeviceType } from "../../services/api";
import type { DeviceType } from "../../types/index.ts"


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