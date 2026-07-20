import { useData } from "./dataOperations";
import { getVmsData, deleteVm } from "../../services/api";
import type { VM } from "../../types/index.ts";

export function useVms() {
    const {
        data: vmsData,
        loading,
        remove: deleteVmById,
    } = useData<VM>({
        getData: getVmsData,
        deleteData: deleteVm,
        getId: vm => vm.ID,
    });

    return {
        vmsData,
        loading,
        deleteVm: deleteVmById,
    };
}