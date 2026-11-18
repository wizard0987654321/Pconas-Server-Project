/* ==========================================================================
 * BOOK THREAD 2.5.8.2  FaultText   (Chapter 2: Rooms)
 * File: src/components/powerSimulation/FaultText.tsx
 *
 * "Fault: Damaged" line of the hover cards.
 *
 * Used by: 2.2.2 RackHoverCard, 2.2.3 UpsHoverCard, 2.5.8 PowerSource, 2.5.16 ConnectionHoverCard,
 *   2.5.17 PduHoverCard
 * Uses: A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import type { FaultType } from "../../types"; // A.13 types

interface FaultTextProps {
    faultType: FaultType;
    t: (key: string) => string;
}

// "Fault: Damaged" line, shared by all hover overlays (equipment and cables)
function FaultText({ faultType, t }: FaultTextProps) {
    return (
        <p>
            <span className="font-semibold">
                {t("pages.rooms.detailedView.faults.label")}:
            </span>{" "}
            <span className="font-semibold text-[#DC2626] dark:text-[#F87171]">
                {t(`pages.rooms.detailedView.faults.types.${faultType}`)}
            </span>
        </p>
    );
}

export default FaultText;

// → Next in the book: 2.5.8.3 DamagedMark  (src/components/powerSimulation/DamagedMark.tsx)
