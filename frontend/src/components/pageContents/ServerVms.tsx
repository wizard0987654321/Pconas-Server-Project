import DataList from "../DataList";
import { useMemo, useState } from "react";
import { transformData } from "../../helpers/transformData";
import { useVms } from "../../helpers/hooks/vmOperations";
import DeletingOverlay from "../overlays/DeletingOverlay";

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