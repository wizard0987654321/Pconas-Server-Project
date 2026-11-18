/* ==========================================================================
 * BOOK THREAD A.10.7  customerOperations   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/helpers/hooks/customerOperations.ts
 *
 * useCustomers: customers table data + delete.
 *
 * HOOK - only provides data / functions to the component that calls it, renders no HTML.
 *
 * Used by: 7.2 AddServiceOverlay, 8.1 ServerCustomers
 * Uses: A.10 dataOperations, A.12 api/index, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useData } from "./dataOperations"; // A.10 dataOperations
import { getCustomersData, deleteCustomer } from "../../services/api"; // A.12 api/index
import type { Customer } from "../../types/index.ts"; // A.13 types

export function useCustomers() {
    const {
        data: customersData,
        loading,
        remove: deleteCustomerById,
    } = useData<Customer>({
        getData: getCustomersData,
        deleteData: deleteCustomer,
        getId: customer => customer.ID,
    });

    return {
        customersData,
        loading,
        deleteCustomer: deleteCustomerById,
    };
}

// → Next in the book: A.11 transformData  (src/helpers/transformData.ts)
