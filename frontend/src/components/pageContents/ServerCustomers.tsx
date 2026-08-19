import DataList from "../DataList";
import { useMemo, useState } from "react";
import { transformData } from "../../helpers/transformData";
import { useCustomers } from "../../helpers/hooks/customerOperations";
import DeletingOverlay from "../overlays/generics/DeletingOverlay";

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