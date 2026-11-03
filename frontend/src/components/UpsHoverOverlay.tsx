
import type { Ups } from "../types";

interface UpsHoverOverlayProps {
    ups: Ups;
    t: (key: string) => string;
}

function UpsHoverOverlay({ ups, t }: UpsHoverOverlayProps) {
    return (
        <div className="font-mono absolute left-1/2 top-full z-10 mt-2 hidden w-40 -translate-x-1/2 rounded-md border-3 border-[#6ADBAF] bg-[#F8FAFC] p-2 text-xs text-[#111827] shadow-lg group-hover:block dark:bg-[#0E1F48] dark:text-[#F9FAFB]">

            <p>
                <span className="font-semibold">
                    {t("common.ups")}:
                </span>{" "}
                {ups.UPSNumber}
            </p>

            <p>
                <span className="font-semibold">
                    {t("common.units")}:
                </span>{" "}
                {ups.UnitsSize} U
            </p>

            <p>
                <span className="font-semibold">
                    {t("common.height")}:
                </span>{" "}
                {ups.HeightCm} cm
            </p>

        </div>
    );
}

export default UpsHoverOverlay;
