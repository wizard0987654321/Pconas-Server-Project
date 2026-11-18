/* ==========================================================================
 * BOOK THREAD 2.5.8.3  DamagedMark   (Chapter 2: Rooms)
 * File: src/components/powerSimulation/DamagedMark.tsx
 *
 * Red X drawn over damaged equipment.
 *
 * Used by: 2.5 DetailedRoom, 2.5.8 PowerSource
 * Uses: 2.5.7 powerStyles
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { DAMAGED_COLOR } from "./powerStyles"; // 2.5.7 powerStyles

// Big red X drawn over the icon of damaged equipment.
// The parent must be `relative`, clicks and hover pass through the X.
function DamagedMark() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2"
        >
            <path d="M4 4 L20 20 M20 4 L4 20" stroke={DAMAGED_COLOR} strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

export default DamagedMark;

// → Next in the book: 2.5.9 AddEquipmentOverlay  (src/components/overlays/AddEquipmentOverlay.tsx)
