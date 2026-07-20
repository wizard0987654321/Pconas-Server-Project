import { useData } from "./dataOperations";
import { getDevicesData, deleteDevice} from "../../services/api";
import type { Device } from "../../types/index.ts"


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