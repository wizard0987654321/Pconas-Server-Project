/* ==========================================================================
 * BOOK THREAD 3  RacksPage   (Chapter 3: Racks)
 * File: src/pages/RacksPage.tsx
 *
 * All racks as a table, or only the racks of one room (/rooms/:roomId/racks). Adding a rack uses the form
 * from 2.2.1.
 *
 * Reached via: URL /racks  (sidebar link "Racks")
 * Used by: 0.5 routes
 * Uses: 2.2.1 AddRackOverlay, 3.1 ServerRacks, A.1 PageHeading, A.2 PrimaryButton
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import ServerRacks from "../components/pageContents/ServerRacks"; // 3.1 ServerRacks
import PageHeading from "../components/PageHeading"; // A.1 PageHeading
import { useParams } from "react-router-dom";
import { useState } from "react";
import AddRackOverlay from "../components/overlays/AddRackOverlay"; // 2.2.1 AddRackOverlay
import PrimaryButton from "../components/buttons/PrimaryButton"; // A.2 PrimaryButton
import { useTranslation } from "react-i18next";


function RacksPage() {
    const { t } = useTranslation();

    const { roomId } = useParams();

    const [isAddRackOpen, setIsAddRackOpen] = useState(false);

    // state for opening overlay
    const handleRackAdded = () => {
        setIsAddRackOpen(true);
    }

    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
            <PageHeading heading="Racks" />
            <div className="w-[100%] flex flex-start">
                <PrimaryButton label={t("pages.racks.addButton")} onClick={handleRackAdded} margin="m-1" />
            </div>
            <ServerRacks /* 3.1 */ internalRoomId={roomId} />

            {/* overlay, located in  src/components/overlays*/}
            {isAddRackOpen && (
                <AddRackOverlay
                    onClose={() => setIsAddRackOpen(false)}
                />
            )}
        </div>
    );
}

export default RacksPage;

// → Next in the book: 3.1 ServerRacks  (src/components/pageContents/ServerRacks.tsx)
