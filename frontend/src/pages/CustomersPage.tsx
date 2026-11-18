/* ==========================================================================
 * BOOK THREAD 8  CustomersPage   (Chapter 8: Customers)
 * File: src/pages/CustomersPage.tsx
 *
 * All customers.
 *
 * Reached via: URL /customers  (sidebar link "Customers")
 * Used by: 0.5 routes
 * Uses: 8.1 ServerCustomers, 8.2 AddCustomerOverlay, A.1 PageHeading, A.2 PrimaryButton
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import PageHeading from "../components/PageHeading"; // A.1 PageHeading
import ServerCustomers from "../components/pageContents/ServerCustomers"; // 8.1 ServerCustomers
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../components/buttons/PrimaryButton"; // A.2 PrimaryButton
import AddCustomerOverlay from "../components/overlays/AddCustomerOverlay"; // 8.2 AddCustomerOverlay

function CustomersPage() {
    const { t } = useTranslation();

    // state for opening overlay
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
            <PageHeading heading="pages.customers.headingText" />

            <div className="w-[100%] flex flex-start">
                <PrimaryButton
                    label={t("pages.customers.addButton")}
                    onClick={() => setIsAddCustomerOpen(true)}
                    margin="m-1"
                />
            </div>

            <ServerCustomers /* 8.1 */ />
            
            {/* overlay, located in  src/components/overlays*/}
            {isAddCustomerOpen && (
                <AddCustomerOverlay /* 8.2 */ onClose={() => setIsAddCustomerOpen(false)} />
            )}
        </div>
    )
}

export default CustomersPage;

// → Next in the book: 8.1 ServerCustomers  (src/components/pageContents/ServerCustomers.tsx)
