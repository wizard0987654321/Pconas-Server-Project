/* ==========================================================================
 * BOOK THREAD 2.5.9  AddEquipmentOverlay   (Chapter 2: Rooms)
 * File: src/components/overlays/AddEquipmentOverlay.tsx
 *
 * Form behind a free "+" place in the room: add a rack or a cabinet UPS.
 *
 * Used by: 2.5 DetailedRoom
 * Uses: A.7 AddOverlay, A.10.1 roomOperations
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */


import { useState } from "react";
import { useRooms } from "../../helpers/hooks/roomOperations"; // A.10.1 roomOperations
import AddOverlay from "./generics/AddOverlay"; // A.7 AddOverlay
import { useTranslation } from "react-i18next";

type AddEquipmentOverlayProps = {
    onClose: () => void;
    roomId?: number | null;
};

function AddEquipmentOverlay({ onClose, roomId }: AddEquipmentOverlayProps) {
    const { t } = useTranslation();
    const { roomsData } = useRooms();

    const [equipmentType, setEquipmentType] = useState<"rack" | "ups">("rack");

    const isRack = equipmentType === "rack";

    return (
        <AddOverlay
            title="Add equipment"
            endpoint={isRack ? "/addRack" : "/addUPS"}
            onClose={onClose}

            initialData={{
                equipmentType: "rack",
                ...(roomId != null ? { roomId: String(roomId) } : {})
            }}

            onFieldChange={(name, value) => {
                if (name === "equipmentType") {
                    setEquipmentType(value as "rack" | "ups");
                }
            }}

            validate={(data) => {
                const selectedRoom = roomsData.find(
                    room => room.ID === Number(data.roomId)
                );

                if (!selectedRoom) {
                    return t("pages.racks.form.validation.noRoomSelected");
                }

                if (Number(data.height) > selectedRoom.HeightCm) {
                    return t("pages.racks.form.validation.heightTooLarge", {
                        height: selectedRoom.HeightCm
                    });
                }

                return null;
            }}

            fields={[
                {
                    name: "equipmentType",
                    label: "Equipment type",
                    options: [
                        { value: "rack", label: "Rack" },
                        { value: "ups", label: "Cabinet UPS" }
                    ]
                },

                ...(roomId == null
                    ? [{
                        name: "roomId",
                        label: t("pages.racks.form.room"),
                        options: roomsData.map((room, index) => ({
                            value: room.ID,
                            label: `${t("common.room")} ${index + 1}`
                        }))
                    }]
                    : []),

                {
                    name: "unitsSize",
                    label: t("pages.racks.form.unitsSize"),
                    min: 1
                },
                {
                    name: "height",
                    label: t("pages.racks.form.height"),
                    min: 0,
                    step: 0.01
                }
            ]}

            transformData={(data) => ({
                [isRack ? "newRack" : "newUPS"]: {
                    roomId: roomId ?? data.roomId,
                    unitsSize: data.unitsSize,
                    heightcm: data.height
                }
            })}
        />
    );
}

export default AddEquipmentOverlay;

// → Next in the book: 2.5.10 AddOutsideEquipmentOverlay  (src/components/overlays/AddOutsideEquipmentOverlay.tsx)
