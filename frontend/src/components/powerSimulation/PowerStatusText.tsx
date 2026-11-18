import type { PowerState } from "../../helpers/powerFlow";
import { POWER_STATE_TEXT_CLASS, powerStateKey } from "./powerStyles";

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
