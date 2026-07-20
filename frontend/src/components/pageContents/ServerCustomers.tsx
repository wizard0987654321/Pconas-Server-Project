import DataList from "../DataList";
import { useMemo, useState } from "react";
import { transformData } from "../../helpers/transformData";
import { useCustomers } from "../../helpers/hooks/customerOperations";
import DeletingOverlay from "../overlays/DeletingOverlay";

function ServerCustomers() {

    const { customersData, deleteCustomer } = useCustomers();
    const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);

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
            {customerToDelete !== null && (
                <DeletingOverlay
                    onCancel={() => setCustomerToDelete(null)}
                    onConfirm={() => {
                        deleteCustomer(customerToDelete);
                        setCustomerToDelete(null);
                    }}
                />
            )}

            <DataList
                data={displayData}
                onDelete={(id: number) => setCustomerToDelete(id)}
            />
        </>
    );
}

export default ServerCustomers;