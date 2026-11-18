/* ==========================================================================
 * BOOK THREAD 2.5.10  AddOutsideEquipmentOverlay   (Chapter 2: Rooms)
 * File: src/components/overlays/AddOutsideEquipmentOverlay.tsx
 *
 * Form behind the "+" next to the grid: add a generator or a fan.
 *
 * Used by: 2.5 DetailedRoom
 * Uses: A.7 AddOverlay
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useTranslation } from "react-i18next";
import AddOverlay from "./generics/AddOverlay"; // A.7 AddOverlay

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

// → Next in the book: 2.5.11 OutsideEquipmentInfoOverlay  (src/components/powerSimulation/OutsideEquipmentInfoOverlay.tsx)
