/* ==========================================================================
 * BOOK THREAD 6.1  ServerVms   (Chapter 6: VMs)
 * File: src/components/pageContents/ServerVms.tsx
 *
 * VMs table (DataList) with delete.
 *
 * Used by: 6 VmsPage
 * Uses: A.6 DataList, A.9 DeletingOverlay, A.10.5 vmOperations, A.11 transformData
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import DataList from "../DataList"; // A.6 DataList
import { useMemo, useState } from "react";
import { transformData } from "../../helpers/transformData"; // A.11 transformData
import { useVms } from "../../helpers/hooks/vmOperations"; // A.10.5 vmOperations
import DeletingOverlay from "../overlays/generics/DeletingOverlay"; // A.9 DeletingOverlay

function ServerVms() {

    const { vmsData, deleteVm } = useVms();
    const [vmToDelete, setVmToDelete] = useState<number | null>(null);

    // using helper function for raw data update
    const displayData = useMemo(
        () =>
            transformData(vmsData, {
                omit: ["ServiceID"],
                rename: {
                    ServiceName: "pages.vms.data.service",
                    DeviceID: "pages.vms.data.device",
                },
            }),
        [vmsData]
    );

    return (
        <>
        {/*showing overlay only when state has id to delete*/}
            {vmToDelete !== null && (
                <DeletingOverlay
                    onCancel={() => setVmToDelete(null)}
                    onConfirm={() => {
                        deleteVm(vmToDelete);
                        setVmToDelete(null);
                    }}
                />
            )}

            {/*passing updated data as prop*/}
            <DataList
                data={displayData}
                onDelete={(id: number) => setVmToDelete(id)}
            />
        </>
    );
}

export default ServerVms;

// → Next in the book: 6.2 AddVmOverlay  (src/components/overlays/AddVmOverlay.tsx)
