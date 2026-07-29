import PageHeading from "../components/PageHeading";
import ServerDevices from "../components/pageContents/ServerDevices";
import { useState } from "react";
import AddDeviceOverlay from "../components/overlays/AddDeviceOverlay";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { useTranslation } from "react-i18next";

function DevicesPage() {
    const { t } = useTranslation();
    
    const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);

    // state for opening overlay
    const handleDeviceAdded = () => {
        setIsAddDeviceOpen(true);
    };

    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
            <PageHeading heading="pages.devices.headingText" />

            <div className="w-[100%] flex flex-start">
                <PrimaryButton
                    label={t("pages.devices.addButton")}
                    onClick={handleDeviceAdded}
                    margin="m-1"
                />
            </div>

            <ServerDevices />

            {/* overlay, located in  src/components/overlays*/}
            {isAddDeviceOpen && (
                <AddDeviceOverlay
                    onClose={() => setIsAddDeviceOpen(false)}
                />
            )}
        </div>
    );
}

export default DevicesPage;