/* ==========================================================================
 * BOOK THREAD A.10.6  serviceOperations   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/helpers/hooks/serviceOperations.ts
 *
 * useServices: services table data + delete.
 *
 * HOOK - only provides data / functions to the component that calls it, renders no HTML.
 *
 * Used by: 6.2 AddVmOverlay, 7.1 ServerServices
 * Uses: A.10 dataOperations, A.12 api/index, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useData } from "./dataOperations"; // A.10 dataOperations
import { getServicesData, deleteService } from "../../services/api"; // A.12 api/index
import type { Service } from "../../types/index.ts"; // A.13 types

export function useServices() {
    const {
        data: servicesData,
        loading,
        remove: deleteServiceById,
    } = useData<Service>({
        getData: getServicesData,
        deleteData: deleteService,
        getId: service => service.ID,
    });

    return {
        servicesData,
        loading,
        deleteService: deleteServiceById,
    };
}

// → Next in the book: A.10.7 customerOperations  (src/helpers/hooks/customerOperations.ts)
