
import type { Connection } from "../types";

interface ConnectionHoverOverlayProps {
    connection: Connection;
    fromLabel: string;
    toLabel: string;
    language: string;
    // Position inside the lines container (middle of the line)
    x: number;
    y: number;
    t: (key: string) => string;
}

// Same look as Rack/UPS hover overlays, but positioned manually at the middle of the line,
// because svg lines can't use the tailwind "group-hover" trick
function ConnectionHoverOverlay({ connection, fromLabel, toLabel, language, x, y, t }: ConnectionHoverOverlayProps) {
    const typeName = language.startsWith("de") ? connection.TypeNameDE : connection.TypeNameEN;

    return (
        <div
            style={{ left: x, top: y }}
            className="font-mono pointer-events-none absolute z-20 mt-2 w-48 -translate-x-1/2 rounded-md border-3 border-[#6ADBAF] bg-[#F8FAFC] p-2 text-xs text-[#111827] shadow-lg dark:bg-[#0E1F48] dark:text-[#F9FAFB]"
        >

            <p>
                <span className="font-semibold">
                    {t("common.cable")}:
                </span>{" "}
                {typeName}
            </p>

            <p>
                <span className="font-semibold">
                    {t("common.from")}:
                </span>{" "}
                {fromLabel}
            </p>

            <p>
                <span className="font-semibold">
                    {t("common.to")}:
                </span>{" "}
                {toLabel}
            </p>

            <p className="flex items-center gap-1">
                <span className="font-semibold">
                    {t("common.color")}:
                </span>
                <span
                    className="inline-block h-3 w-3 rounded-full border border-black/30"
                    style={{ backgroundColor: connection.Color }}
                />
            </p>

        </div>
    );
}

export default ConnectionHoverOverlay;
