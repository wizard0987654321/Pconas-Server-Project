/* ==========================================================================
 * BOOK THREAD 7.2  AddServiceOverlay   (Chapter 7: Services)
 * File: src/components/overlays/AddServiceOverlay.tsx
 *
 * Form to add a service (name, customer).
 *
 * Used by: 7 ServicesPage
 * Uses: A.7 AddOverlay, A.10.7 customerOperations
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import AddOverlay from "./generics/AddOverlay"; // A.7 AddOverlay
import { useCustomers } from "../../helpers/hooks/customerOperations"; // A.10.7 customerOperations
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

// → Next in the book: 8 CustomersPage  (src/pages/CustomersPage.tsx)
