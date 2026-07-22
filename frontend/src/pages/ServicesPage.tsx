import PageHeading from "../components/PageHeading";
import ServerServices from "../components/pageContents/ServerServices";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../components/buttons/PrimaryButton";
import AddServiceOverlay from "../components/overlays/AddServiceOverlay";

function ServicesPage() {
    const { t } = useTranslation();
    const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
            <PageHeading heading="pages.services.headingText" />

            <div className="w-[100%] flex flex-start">
                <PrimaryButton
                    label={t("pages.services.addButton")}
                    onClick={() => setIsAddServiceOpen(true)}
                    margin="m-1"
                />
            </div>

            <ServerServices />

            {isAddServiceOpen && (
                <AddServiceOverlay onClose={() => setIsAddServiceOpen(false)} />
            )}
        </div>
    )
}

export default ServicesPage;