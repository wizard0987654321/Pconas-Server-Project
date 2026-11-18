/* ==========================================================================
 * BOOK THREAD 4  DeviceTypesPage   (Chapter 4: Device Types)
 * File: src/pages/DeviceTypesPage.tsx
 *
 * All device types (server, switch, in-rack UPS, ...).
 *
 * Reached via: URL /deviceTypes  (sidebar link "Device Types")
 * Used by: 0.5 routes
 * Uses: 4.1 ServerDeviceTypes, 4.2 AddDeviceTypeOverlay, A.1 PageHeading, A.2 PrimaryButton
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import ServerDeviceTypes from "../components/pageContents/ServerDeviceTypes"; // 4.1 ServerDeviceTypes
import PageHeading from "../components/PageHeading"; // A.1 PageHeading
import { useState } from "react";
import AddDeviceTypeOverlay from "../components/overlays/AddDeviceTypeOverlay"; // 4.2 AddDeviceTypeOverlay
import PrimaryButton from "../components/buttons/PrimaryButton"; // A.2 PrimaryButton
import { useTranslation } from "react-i18next";

function DeviceTypesPage() {
    const { t } = useTranslation();
    const [isAddDeviceTypeOpen, setIsAddDeviceTypeOpen] = useState(false);

    // state for opening overlay
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

            <ServerDeviceTypes /* 4.1 */ />

            {/* overlay, located in  src/components/overlays*/}
            {isAddDeviceTypeOpen && (
                <AddDeviceTypeOverlay
                    onClose={() => setIsAddDeviceTypeOpen(false)}
                />
            )}
        </div>
    );
}

export default DeviceTypesPage;

// → Next in the book: 4.1 ServerDeviceTypes  (src/components/pageContents/ServerDeviceTypes.tsx)
