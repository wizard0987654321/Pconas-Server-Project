import AddOverlay from "./generics/AddOverlay";
import { useCustomers } from "../../helpers/hooks/customerOperations";
import { useTranslation } from "react-i18next";

type AddServiceOverlayProps = {
    onClose: () => void;
};

function AddServiceOverlay({ onClose }: AddServiceOverlayProps) {
    const { t } = useTranslation();
    const { customersData } = useCustomers();

    return (
        <AddOverlay
            title={t("pages.services.form.title")}
            endpoint="/addService"
            onClose={onClose}
            fields={[
                {
                    name: "name",
                    label: t("pages.services.form.serviceName"),
                    type: "text",
                },
                {
                    name: "customerId",
                    label: t("pages.services.form.customer"),
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