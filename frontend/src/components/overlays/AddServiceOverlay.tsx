import AddOverlay from "./AddOverlay";
import { useCustomers } from "../../helpers/hooks/customerOperations";

type AddServiceOverlayProps = {
    onClose: () => void;
};

function AddServiceOverlay({ onClose }: AddServiceOverlayProps) {
    const { customersData } = useCustomers();

    return (
        <AddOverlay
            title="Add New Service"
            endpoint="/addService"
            onClose={onClose}
            fields={[
                {
                    name: "name",
                    label: "Service Name",
                    type: "text",
                },
                {
                    name: "customerId",
                    label: "Customer",
                    options: customersData.map((customer) => ({
                        value: customer.ID,
                        label: customer.Name,
                    })),
                },
            ]}
            transformData={(data) => ({
                newService: {
                    name: data.name,
                    customerId: Number(data.customerId),
                },
            })}
        />
    );
}

export default AddServiceOverlay;