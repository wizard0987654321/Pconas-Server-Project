import powerIcon from "../../assets/powerIcon.svg";

import type { FaultType } from "../../types";
import type { PowerState } from "../../helpers/powerFlow";
import { POWER_STATE_ICON_CLASS } from "./powerStyles";
import PowerStatusText from "./PowerStatusText";
import FaultText from "./FaultText";
import DamagedMark from "./DamagedMark";

interface PowerSourceProps {
    state: PowerState;
    faultType?: FaultType;
    // Registers the icon for the cable line calculation (setEquipmentRef(powerSource.ID))
    iconRef: (el: HTMLElement | null) => void;
    t: (key: string) => string;
}

// Fixed outer power source (utility grid) of the room, drawn above the room border
function PowerSource({ state, faultType, iconRef, t }: PowerSourceProps) {
    return (
        <div className="pointer-events-auto relative group flex justify-center">
            <img
                ref={iconRef}
                src={powerIcon}
                alt={t("pages.rooms.detailedView.power.grid")}
                className={`w-20 transition-transform duration-150 hover:scale-110 ${POWER_STATE_ICON_CLASS[state]}`}
            />

            {faultType === "damaged" && <DamagedMark />}

            {/* Same look as the other equipment hover overlays */}
            <div className="font-mono absolute left-1/2 top-full z-10 mt-2 hidden w-44 -translate-x-1/2 rounded-md border-3 border-[#6ADBAF] bg-[#F8FAFC] p-2 text-xs text-[#111827] shadow-lg group-hover:block dark:bg-[#0E1F48] dark:text-[#F9FAFB]">
                <p className="font-semibold">{t("pages.rooms.detailedView.power.grid")}</p>
                <PowerStatusText state={state} t={t} />
                {faultType && <FaultText faultType={faultType} t={t} />}
            </div>
        </div>
    );
}

export default PowerSource;
