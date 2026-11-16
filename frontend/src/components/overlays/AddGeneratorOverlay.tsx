import { useTranslation } from "react-i18next";
import AddOverlay from "./generics/AddOverlay";

type AddGeneratorOverlayProps = {
    onClose: () => void;
    roomId: number;
};

// Adding an emergency power source next to the grid (only "Generator" for now)
function AddGeneratorOverlay({ onClose, roomId }: AddGeneratorOverlayProps) {
    const { t } = useTranslation();

    return (
        <AddOverlay
            title={t("pages.rooms.detailedView.power.addPowerSource")}
            endpoint="/addGenerator"
            onClose={onClose}
            fields={[
                {
                    name: "powerSourceType",
                    label: t("common.type"),
                    options: [{ value: "generator", label: t("pages.rooms.detailedView.power.generator") }],
                },
            ]}
            transformData={() => ({ roomId })}
        />
    );
}

export default AddGeneratorOverlay;
