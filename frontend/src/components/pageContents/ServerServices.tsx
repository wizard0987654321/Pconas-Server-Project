import DataList from "../DataList";
import { useMemo, useState } from "react";
import { transformData } from "../../helpers/transformData";
import { useServices } from "../../helpers/hooks/serviceOperations";
import DeletingOverlay from "../overlays/generics/DeletingOverlay";

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