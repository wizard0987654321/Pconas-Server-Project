
import type { Pdu } from "../types";
import type { PowerState } from "../helpers/powerFlow";
import PowerStatusText from "./simulation/PowerStatusText";

interface PduHoverOverlayProps {
    pdu: Pdu;
    powerState?: PowerState;
    t: (key: string) => string;
}

function PduHoverOverlay({ pdu, powerState, t }: PduHoverOverlayProps) {
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

            {powerState && <PowerStatusText state={powerState} t={t} />}

        </div>
    );
}

export default PduHoverOverlay;
