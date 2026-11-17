
import type { Rack, FaultType } from "../types";
import type { PowerState } from "../helpers/powerFlow";
import PowerStatusText from "./simulation/PowerStatusText";
import FaultText from "./simulation/FaultText";

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

            {powerState && <PowerStatusText state={powerState} t={t} />}
            {devicesOnRackUps > 0 && (
                <p className="font-semibold text-[#D97706] dark:text-[#F59E0B]">
                    {t("pages.rooms.detailedView.power.devicesOnRackUps")}: {devicesOnRackUps}
                </p>
            )}
            {faultType && <FaultText faultType={faultType} t={t} />}
        </div>
    );
}

export default RackHoverOverlay;
