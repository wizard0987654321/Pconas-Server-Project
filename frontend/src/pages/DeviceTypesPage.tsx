import ServerDeviceTypes from "../components/pageContents/ServerDeviceTypes";
import PageHeading from "../components/PageHeading";
import { useState } from "react";
import AddDeviceTypeOverlay from "../components/overlays/AddDeviceTypeOverlay";
import PrimaryButton from "../components/buttons/PrimaryButton";

function DeviceTypesPage() {
    const [isAddDeviceTypeOpen, setIsAddDeviceTypeOpen] = useState(false);

    const handleDeviceTypeAdded = () => {
        setIsAddDeviceTypeOpen(true);
    };

    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
            <PageHeading heading="Device Types" />

            <PrimaryButton
                label="Add Device Type"
                onClick={handleDeviceTypeAdded}
                margin="m-1"
            />

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