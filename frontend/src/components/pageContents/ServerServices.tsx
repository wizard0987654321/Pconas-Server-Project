import DataList from "../DataList";
import { useMemo, useState } from "react";
import { transformData } from "../../helpers/transformData";
import { useServices } from "../../helpers/hooks/serviceOperations";
import DeletingOverlay from "../overlays/DeletingOverlay";

function ServerServices() {

    const { servicesData, deleteService } = useServices();
    const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

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
            {serviceToDelete !== null && (
                <DeletingOverlay
                    onCancel={() => setServiceToDelete(null)}
                    onConfirm={() => {
                        deleteService(serviceToDelete);
                        setServiceToDelete(null);
                    }}
                />
            )}

            <DataList
                data={displayData}
                onDelete={(id: number) => setServiceToDelete(id)}
            />
        </>
    );
}

export default ServerServices;