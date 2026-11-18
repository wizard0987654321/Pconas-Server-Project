/* ==========================================================================
 * BOOK THREAD 6  VmsPage   (Chapter 6: VMs)
 * File: src/pages/VmsPage.tsx
 *
 * All virtual machines (which service runs on which device).
 *
 * Reached via: URL /vms  (sidebar link "VMs")
 * Used by: 0.5 routes
 * Uses: 6.1 ServerVms, 6.2 AddVmOverlay, A.1 PageHeading, A.2 PrimaryButton
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import PageHeading from "../components/PageHeading"; // A.1 PageHeading
import ServerVms from "../components/pageContents/ServerVms"; // 6.1 ServerVms
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../components/buttons/PrimaryButton"; // A.2 PrimaryButton
import AddVmOverlay from "../components/overlays/AddVmOverlay"; // 6.2 AddVmOverlay

function VmsPage() {
    const { t } = useTranslation();

    // state for opening overlay
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

            <ServerVms /* 6.1 */ />

            {/* overlay, located in  src/components/overlays*/}
            {isAddVmOpen && (
                <AddVmOverlay /* 6.2 */ onClose={() => setIsAddVmOpen(false)} />
            )}
        </div>
    )
}

export default VmsPage;

// → Next in the book: 6.1 ServerVms  (src/components/pageContents/ServerVms.tsx)
