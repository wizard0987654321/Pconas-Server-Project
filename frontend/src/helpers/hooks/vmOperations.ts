/* ==========================================================================
 * BOOK THREAD A.10.5  vmOperations   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/helpers/hooks/vmOperations.ts
 *
 * useVms: VMs table data + delete.
 *
 * HOOK - only provides data / functions to the component that calls it, renders no HTML.
 *
 * Used by: 6.1 ServerVms
 * Uses: A.10 dataOperations, A.12 api/index, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useData } from "./dataOperations"; // A.10 dataOperations
import { getVmsData, deleteVm } from "../../services/api"; // A.12 api/index
import type { VM } from "../../types/index.ts"; // A.13 types

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

// → Next in the book: A.10.6 serviceOperations  (src/helpers/hooks/serviceOperations.ts)
