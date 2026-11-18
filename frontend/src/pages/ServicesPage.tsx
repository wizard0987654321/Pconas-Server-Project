/* ==========================================================================
 * BOOK THREAD 7  ServicesPage   (Chapter 7: Services)
 * File: src/pages/ServicesPage.tsx
 *
 * All services (what a customer runs).
 *
 * Reached via: URL /services  (sidebar link "Services")
 * Used by: 0.5 routes
 * Uses: 7.1 ServerServices, 7.2 AddServiceOverlay, A.1 PageHeading, A.2 PrimaryButton
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import PageHeading from "../components/PageHeading"; // A.1 PageHeading
import ServerServices from "../components/pageContents/ServerServices"; // 7.1 ServerServices
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../components/buttons/PrimaryButton"; // A.2 PrimaryButton
import AddServiceOverlay from "../components/overlays/AddServiceOverlay"; // 7.2 AddServiceOverlay

function ServicesPage() {
    const { t } = useTranslation();

    // state for opening overlay
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

            <ServerServices /* 7.1 */ />

            {/* overlay, located in  src/components/overlays*/}
            {isAddServiceOpen && (
                <AddServiceOverlay /* 7.2 */ onClose={() => setIsAddServiceOpen(false)} />
            )}
        </div>
    )
}

export default ServicesPage;

// → Next in the book: 7.1 ServerServices  (src/components/pageContents/ServerServices.tsx)
