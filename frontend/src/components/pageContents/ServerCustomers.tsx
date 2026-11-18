/* ==========================================================================
 * BOOK THREAD 8.1  ServerCustomers   (Chapter 8: Customers)
 * File: src/components/pageContents/ServerCustomers.tsx
 *
 * Customers table (DataList) with delete.
 *
 * Used by: 8 CustomersPage
 * Uses: A.6 DataList, A.9 DeletingOverlay, A.10.7 customerOperations, A.11 transformData
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import DataList from "../DataList"; // A.6 DataList
import { useMemo, useState } from "react";
import { transformData } from "../../helpers/transformData"; // A.11 transformData
import { useCustomers } from "../../helpers/hooks/customerOperations"; // A.10.7 customerOperations
import DeletingOverlay from "../overlays/generics/DeletingOverlay"; // A.9 DeletingOverlay

function ServerCustomers() {

    const { customersData, deleteCustomer } = useCustomers();
    const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);

    // using helper function for raw data update
    const displayData = useMemo(
        () =>
            transformData(customersData, {
                rename: {
                    PhoneNumber: "pages.customers.data.number"
                },
            }),
        [customersData]
    );

    return (
        <>
            {/*showing overlay only when state has id to delete*/}
            {customerToDelete !== null && (
                <DeletingOverlay
                    onCancel={() => setCustomerToDelete(null)}
                    onConfirm={() => {
                        deleteCustomer(customerToDelete);
                        setCustomerToDelete(null);
                    }}
                />
            )}

            {/*passing updated data as prop*/}
            <DataList
                data={displayData}
                onDelete={(id: number) => setCustomerToDelete(id)}
            />
        </>
    );
}

export default ServerCustomers;

// → Next in the book: 8.2 AddCustomerOverlay  (src/components/overlays/AddCustomerOverlay.tsx)
