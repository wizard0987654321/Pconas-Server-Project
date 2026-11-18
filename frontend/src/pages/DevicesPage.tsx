/* ==========================================================================
 * BOOK THREAD 5  DevicesPage   (Chapter 5: Devices)
 * File: src/pages/DevicesPage.tsx
 *
 * All devices of all racks. Adding a device uses the form from 2.6.1.
 *
 * Reached via: URL /devices  (sidebar link "Devices")
 * Used by: 0.5 routes
 * Uses: 2.6.1 AddDeviceOverlay, 5.1 ServerDevices, A.1 PageHeading, A.2 PrimaryButton
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import PageHeading from "../components/PageHeading"; // A.1 PageHeading
import ServerDevices from "../components/pageContents/ServerDevices"; // 5.1 ServerDevices
import { useState } from "react";
import AddDeviceOverlay from "../components/overlays/AddDeviceOverlay"; // 2.6.1 AddDeviceOverlay
import PrimaryButton from "../components/buttons/PrimaryButton"; // A.2 PrimaryButton
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

            <ServerDevices /* 5.1 */ />

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

// → Next in the book: 5.1 ServerDevices  (src/components/pageContents/ServerDevices.tsx)
