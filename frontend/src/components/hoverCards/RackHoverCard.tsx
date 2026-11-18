/* ==========================================================================
 * BOOK THREAD 2.2.2  RackHoverCard   (Chapter 2: Rooms)
 * File: src/components/hoverCards/RackHoverCard.tsx
 *
 * Info card shown while hovering a rack: number, size, height and (in the detailed room view) power state and
 * fault.
 *
 * Used by: 2.2 ServerRoom, 2.5 DetailedRoom
 * Uses: 2.5.2.1 powerFlow, 2.5.8.1 PowerStatusText, 2.5.8.2 FaultText, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */


import type { Rack, FaultType } from "../../types"; // A.13 types
import type { PowerState } from "../../helpers/powerFlow"; // 2.5.2.1 powerFlow
import PowerStatusText from "../powerSimulation/PowerStatusText"; // 2.5.8.1 PowerStatusText
import FaultText from "../powerSimulation/FaultText"; // 2.5.8.2 FaultText

interface RackHoverOverlayProps {
    rack: Rack;
    powerState?: PowerState;
    faultType?: FaultType;
    // Devices still running on an in-rack UPS battery (only shown when > 0)
    devicesOnRackUps?: number;
    t: (key: string) => string;
}

function RackHoverOverlay({ rack, powerState, faultType, devicesOnRackUps = 0, t }: RackHoverOverlayProps) {
    return (
        <div className="font-mono absolute left-1/2 top-full z-10 mt-2 hidden w-40 -translate-x-1/2 rounded-md border-3 border-[#6ADBAF] bg-[#F8FAFC] p-2 text-xs text-[#111827] shadow-lg group-hover:block dark:bg-[#0E1F48] dark:text-[#F9FAFB]">
            <p>
                <span className="font-semibold">
                    {t("common.rack")}:
                </span>{" "}
                {rack.RackNumber}
            </p>

            <p>
                <span className="font-semibold">
                    {t("common.units")}:
                </span>{" "}
                {rack.UnitsSize} U
            </p>

            <p>
                <span className="font-semibold">
                    {t("common.height")}:
                </span>{" "}
                {rack.HeightCm} cm
            </p>

            {powerState && <PowerStatusText /* 2.5.8.1 */ state={powerState} t={t} />}
            {devicesOnRackUps > 0 && (
                <p className="font-semibold text-[#D97706] dark:text-[#F59E0B]">
                    {t("pages.rooms.detailedView.power.devicesOnRackUps")}: {devicesOnRackUps}
                </p>
            )}
            {faultType && <FaultText /* 2.5.8.2 */ faultType={faultType} t={t} />}
        </div>
    );
}

export default RackHoverOverlay;

// → Next in the book: 2.2.3 UpsHoverCard  (src/components/hoverCards/UpsHoverCard.tsx)
