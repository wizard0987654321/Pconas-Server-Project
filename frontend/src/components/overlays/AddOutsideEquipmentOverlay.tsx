import { useTranslation } from "react-i18next";
import AddOverlay from "./generics/AddOverlay";

type AddOutsideEquipmentOverlayProps = {
    onClose: () => void;
    roomId: number;
};

// Adding a generator or a fan in a free place next to the grid
function AddOutsideEquipmentOverlay({ onClose, roomId }: AddOutsideEquipmentOverlayProps) {
    const { t } = useTranslation();

    return (
        <AddOverlay
            title={t("pages.rooms.detailedView.power.addOutsideEquipment")}
            endpoint="/addOutsideEquipment"
            onClose={onClose}
            fields={[
                {
                    name: "type",
                    label: t("common.type"),
                    options: [
                        { value: "generator", label: t("pages.rooms.detailedView.power.generator") },
                        { value: "fan", label: t("pages.rooms.detailedView.power.fan") },
                    ],
                },
            ]}
            transformData={(data) => ({ roomId, type: data.type })}
        />
    );
}

export default AddOutsideEquipmentOverlay;
