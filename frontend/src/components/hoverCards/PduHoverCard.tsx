/* ==========================================================================
 * BOOK THREAD 2.5.17  PduHoverCard   (Chapter 2: Rooms)
 * File: src/components/hoverCards/PduHoverCard.tsx
 *
 * Info card shown while hovering a PDU.
 *
 * Used by: 2.5 DetailedRoom
 * Uses: 2.5.2.1 powerFlow, 2.5.8.1 PowerStatusText, 2.5.8.2 FaultText, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */


import type { Pdu, FaultType } from "../../types"; // A.13 types
import type { PowerState } from "../../helpers/powerFlow"; // 2.5.2.1 powerFlow
import PowerStatusText from "../powerSimulation/PowerStatusText"; // 2.5.8.1 PowerStatusText
import FaultText from "../powerSimulation/FaultText"; // 2.5.8.2 FaultText

interface PduHoverOverlayProps {
    pdu: Pdu;
    powerState?: PowerState;
    faultType?: FaultType;
    t: (key: string) => string;
}

function PduHoverOverlay({ pdu, powerState, faultType, t }: PduHoverOverlayProps) {
    return (
        <div className="font-mono absolute left-1/2 top-full z-10 mt-2 hidden w-40 -translate-x-1/2 rounded-md border-3 border-[#6ADBAF] bg-[#F8FAFC] p-2 text-xs text-[#111827] shadow-lg group-hover:block dark:bg-[#0E1F48] dark:text-[#F9FAFB]">

            <p>
                <span className="font-semibold">
                    {t("common.pdu")}:
                </span>{" "}
                {pdu.PDUNumber}
            </p>

            <p>
                <span className="font-semibold">
                    {t("common.outlets")}:
                </span>{" "}
                {pdu.OutletCount ?? t("common.unknown")}
            </p>

            {powerState && <PowerStatusText /* 2.5.8.1 */ state={powerState} t={t} />}
            {faultType && <FaultText /* 2.5.8.2 */ faultType={faultType} t={t} />}

        </div>
    );
}

export default PduHoverOverlay;

// → Next in the book: 2.6 DetailedRack  (src/components/detailedViews/DetailedRack.tsx)
