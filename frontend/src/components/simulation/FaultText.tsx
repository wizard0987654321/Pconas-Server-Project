import type { FaultType } from "../../types";

interface FaultTextProps {
    faultType: FaultType;
    t: (key: string) => string;
}

// "Fault: Damaged" line, shared by all hover overlays (equipment and cables)
function FaultText({ faultType, t }: FaultTextProps) {
    return (
        <p>
            <span className="font-semibold">
                {t("pages.rooms.detailedView.faults.label")}:
            </span>{" "}
            <span className="font-semibold text-[#DC2626] dark:text-[#F87171]">
                {t(`pages.rooms.detailedView.faults.types.${faultType}`)}
            </span>
        </p>
    );
}

export default FaultText;
