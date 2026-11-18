/* ==========================================================================
 * BOOK THREAD 8.2  AddCustomerOverlay   (Chapter 8: Customers)
 * File: src/components/overlays/AddCustomerOverlay.tsx
 *
 * Form to add a customer (name, phone number).
 *
 * Used by: 8 CustomersPage
 * Uses: A.7 AddOverlay
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import AddOverlay from "./generics/AddOverlay"; // A.7 AddOverlay
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

// → Next in the book: A.1 PageHeading  (src/components/PageHeading.tsx)
