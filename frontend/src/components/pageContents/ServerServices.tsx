/* ==========================================================================
 * BOOK THREAD 7.1  ServerServices   (Chapter 7: Services)
 * File: src/components/pageContents/ServerServices.tsx
 *
 * Services table (DataList) with delete.
 *
 * Used by: 7 ServicesPage
 * Uses: A.6 DataList, A.9 DeletingOverlay, A.10.6 serviceOperations, A.11 transformData
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import DataList from "../DataList"; // A.6 DataList
import { useMemo, useState } from "react";
import { transformData } from "../../helpers/transformData"; // A.11 transformData
import { useServices } from "../../helpers/hooks/serviceOperations"; // A.10.6 serviceOperations
import DeletingOverlay from "../overlays/generics/DeletingOverlay"; // A.9 DeletingOverlay

function ServerServices() {

    const { servicesData, deleteService } = useServices();
    const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

    // using helper function for raw data update
    const displayData = useMemo(
        () =>
            transformData(servicesData, {
                rename: {
                    Name: "pages.services.data.name",
                    Customer: "pages.services.data.customer"
                },
            }),
        [servicesData]
    );

    return (
        <>
            {/*showing overlay only when state has id to delete*/}
            {serviceToDelete !== null && (
                <DeletingOverlay
                    onCancel={() => setServiceToDelete(null)}
                    onConfirm={() => {
                        deleteService(serviceToDelete);
                        setServiceToDelete(null);
                    }}
                />
            )}

            {/*passing updated data as prop*/}
            <DataList
                data={displayData}
                onDelete={(id: number) => setServiceToDelete(id)}
            />
        </>
    );
}

export default ServerServices;

// → Next in the book: 7.2 AddServiceOverlay  (src/components/overlays/AddServiceOverlay.tsx)
