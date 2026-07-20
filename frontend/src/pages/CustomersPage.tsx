import PageHeading from "../components/PageHeading";
import ServerCustomers from "../components/pageContents/ServerCustomers";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../components/buttons/PrimaryButton";
import AddCustomerOverlay from "../components/overlays/AddCustomerOverlay";

function CustomersPage() {
    const { t } = useTranslation();
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
            <PageHeading heading="pages.customers.headingText" />

            <PrimaryButton
                label={t("pages.customers.addButton")}
                onClick={() => setIsAddCustomerOpen(true)}
                margin="m-1"
            />

            <ServerCustomers />

            {isAddCustomerOpen && (
                <AddCustomerOverlay onClose={() => setIsAddCustomerOpen(false)} />
            )}
        </div>
    )
}

export default CustomersPage;