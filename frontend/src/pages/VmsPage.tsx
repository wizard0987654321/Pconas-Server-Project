import PageHeading from "../components/PageHeading";
import ServerVms from "../components/pageContents/ServerVms";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../components/buttons/PrimaryButton";
import AddVmOverlay from "../components/overlays/AddVmOverlay";

function VmsPage() {
    const { t } = useTranslation();
    const [isAddVmOpen, setIsAddVmOpen] = useState(false);

    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
            <PageHeading heading="pages.vms.headingText" />
            <div className="w-[100%] flex flex-start">

                <PrimaryButton
                    label={t("pages.vms.addButton")}
                    onClick={() => setIsAddVmOpen(true)}
                    margin="m-1"
                />
            </div>

            <ServerVms />

            {isAddVmOpen && (
                <AddVmOverlay onClose={() => setIsAddVmOpen(false)} />
            )}
        </div>
    )
}

export default VmsPage;