import AddOverlay from "./AddOverlay";

type AddCustomerOverlayProps = {
    onClose: () => void;
};

function AddCustomerOverlay({ onClose }: AddCustomerOverlayProps) {
    return (
        <AddOverlay
            title="Add New Customer"
            endpoint="/addCustomer"
            onClose={onClose}
            fields={[
                {
                    name: "name",
                    label: "Name",
                    type: "text",
                },
                {
                    name: "phoneNumber",
                    label: "Phone Number",
                    type: "text",
                },
            ]}
            transformData={(data) => ({
                newCustomer: {
                    name: data.name,
                    phoneNumber: data.phoneNumber,
                },
            })}
        />
    );
}

export default AddCustomerOverlay;