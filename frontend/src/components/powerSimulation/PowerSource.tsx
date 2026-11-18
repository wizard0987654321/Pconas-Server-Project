/* ==========================================================================
 * BOOK THREAD 2.5.8  PowerSource   (Chapter 2: Rooms)
 * File: src/components/powerSimulation/PowerSource.tsx
 *
 * Icon of the power grid or a generator, with its hover info.
 *
 * Used by: 2.5 DetailedRoom
 * Uses: 2.5.2.1 powerFlow, 2.5.7 powerStyles, 2.5.8.1 PowerStatusText, 2.5.8.2 FaultText,
 *   2.5.8.3 DamagedMark, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import powerIcon from "../../assets/powerIcon.svg";
import generatorIcon from "../../assets/generatorIcon.svg";

import type { FaultType, PowerSource as PowerSourceData } from "../../types"; // A.13 types
import type { PowerState } from "../../helpers/powerFlow"; // 2.5.2.1 powerFlow
import { POWER_STATE_ICON_CLASS } from "./powerStyles"; // 2.5.7 powerStyles
import PowerStatusText from "./PowerStatusText"; // 2.5.8.1 PowerStatusText
import FaultText from "./FaultText"; // 2.5.8.2 FaultText
import DamagedMark from "./DamagedMark"; // 2.5.8.3 DamagedMark

interface PowerSourceProps {
    type: PowerSourceData["Type"];
    // Shown name ("Power grid", "Generator 1")
    label: string;
    state: PowerState;
    faultType?: FaultType;
    // Registers the icon for the cable line calculation (setEquipmentRef(powerSource.ID))
    iconRef: (el: HTMLElement | null) => void;
    // Extra classes for the icon (e.g. selection ring) and click handler (trainer selection)
    iconClassName?: string;
    onClick?: () => void;
    t: (key: string) => string;
}

// Power source of the room (grid or generator), drawn above the room border
function PowerSource({ type, label, state, faultType, iconRef, iconClassName = "", onClick, t }: PowerSourceProps) {
    return (
        <div className="pointer-events-auto relative group flex justify-center">
            <img
                ref={iconRef}
                src={type === "generator" ? generatorIcon : powerIcon}
                alt={label}
                onClick={onClick}
                className={`h-20 w-auto cursor-pointer transition-transform duration-150 hover:scale-110 ${POWER_STATE_ICON_CLASS[state]} ${iconClassName}`}
            />

            {faultType === "damaged" && <DamagedMark /* 2.5.8.3 */ />}

            {/* Same look as the other equipment hover overlays */}
            <div className="font-mono absolute left-1/2 top-full z-10 mt-2 hidden w-44 -translate-x-1/2 rounded-md border-3 border-[#6ADBAF] bg-[#F8FAFC] p-2 text-xs text-[#111827] shadow-lg group-hover:block dark:bg-[#0E1F48] dark:text-[#F9FAFB]">
                <p className="font-semibold">{label}</p>
                <PowerStatusText /* 2.5.8.1 */ state={state} t={t} />
                {faultType && <FaultText /* 2.5.8.2 */ faultType={faultType} t={t} />}
            </div>
        </div>
    );
}

export default PowerSource;

// → Next in the book: 2.5.8.1 PowerStatusText  (src/components/powerSimulation/PowerStatusText.tsx)
