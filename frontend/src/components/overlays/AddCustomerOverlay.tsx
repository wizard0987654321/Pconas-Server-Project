import AddOverlay from "./AddOverlay";
import { useTranslation } from "react-i18next";

type AddCustomerOverlayProps = {
    onClose: () => void;
};

function AddCustomerOverlay({ onClose }: AddCustomerOverlayProps) {
    const { t } = useTranslation();

    return (
        <AddOverlay
            title={t("pages.customers.form.title")}
            endpoint="/addCustomer"
            onClose={onClose}
            fields={[
                {
                    name: "name",
                    label: t("pages.customers.form.name"),
                    type: "text",
                },
                {
                    name: "phoneNumber",
                    label: t("pages.customers.form.phoneNumber"),
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