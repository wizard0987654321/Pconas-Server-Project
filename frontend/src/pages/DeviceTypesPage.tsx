import ServerDeviceTypes from "../components/pageContents/ServerDeviceTypes";
import PageHeading from "../components/PageHeading";
import { useState } from "react";
import AddDeviceTypeOverlay from "../components/overlays/AddDeviceTypeOverlay";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { useTranslation } from "react-i18next";

function DeviceTypesPage() {
    const { t } = useTranslation();
    const [isAddDeviceTypeOpen, setIsAddDeviceTypeOpen] = useState(false);

    const handleDeviceTypeAdded = () => {
        setIsAddDeviceTypeOpen(true);
    };

    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
            <PageHeading heading="pages.deviceTypes.headingText" />

            <div className="w-[100%] flex flex-start">
                <PrimaryButton
                    label={t("pages.deviceTypes.addButton")}
                    onClick={handleDeviceTypeAdded}
                    margin="m-1"
                />
            </div>

            <ServerDeviceTypes />

            {isAddDeviceTypeOpen && (
                <AddDeviceTypeOverlay
                    onClose={() => setIsAddDeviceTypeOpen(false)}
                />
            )}
        </div>
    );
}

export default DeviceTypesPage;