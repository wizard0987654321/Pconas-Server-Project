/* ==========================================================================
 * BOOK THREAD 2.5.8.1  PowerStatusText   (Chapter 2: Rooms)
 * File: src/components/powerSimulation/PowerStatusText.tsx
 *
 * "Power: Powered / On UPS battery / No power" line of the hover cards.
 *
 * Used by: 2.2.2 RackHoverCard, 2.2.3 UpsHoverCard, 2.5.8 PowerSource, 2.5.17 PduHoverCard
 * Uses: 2.5.2.1 powerFlow, 2.5.7 powerStyles
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import type { PowerState } from "../../helpers/powerFlow"; // 2.5.2.1 powerFlow
import { POWER_STATE_TEXT_CLASS, powerStateKey } from "./powerStyles"; // 2.5.7 powerStyles

interface PowerStatusTextProps {
    state: PowerState;
    t: (key: string) => string;
}

// "Power: Powered / On UPS battery / No power" line, shared by all equipment hover overlays
function PowerStatusText({ state, t }: PowerStatusTextProps) {
    return (
        <p>
            <span className="font-semibold">
                {t("pages.rooms.detailedView.power.status")}:
            </span>{" "}
            <span className={`font-semibold ${POWER_STATE_TEXT_CLASS[state]}`}>
                {t(powerStateKey(state))}
            </span>
        </p>
    );
}

export default PowerStatusText;

// → Next in the book: 2.5.8.2 FaultText  (src/components/powerSimulation/FaultText.tsx)
