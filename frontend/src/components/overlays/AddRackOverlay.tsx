// AddRackOverlay.tsx

import { useRooms } from "../../helpers/hooks/roomOperations";
import AddOverlay from "./generics/AddOverlay";
import { useTranslation } from "react-i18next";

type AddRackOverlayProps = {
    onClose: () => void;
    roomId?: number | null;
};

function AddRackOverlay({ onClose, roomId }: AddRackOverlayProps) {
    const { t } = useTranslation();
    const { roomsData } = useRooms();

    return (
        <AddOverlay
            title={t("pages.racks.form.title")}
            endpoint="/addRack"
            onClose={onClose}
            initialData={roomId != null ? { roomId: String(roomId) } : undefined}
            validate={(data) => {
                const selectedRoom = roomsData.find(room => room.ID === Number(data.roomId));

                if (!selectedRoom) return t("pages.racks.form.validation.noRoomSelected");

                {/* checking that rakc height is not more than room height */}
                if (Number(data.height) > selectedRoom.HeightCm) {
                    return t("pages.racks.form.validation.heightTooLarge", { height: selectedRoom.HeightCm });
                }

                return null;
            }}
            fields={[
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
                newRack: {
                    roomId: roomId ?? data.roomId,
                    unitsSize: data.unitsSize,
                    heightcm: data.height
                }
            })}
        />
    );
}

export default AddRackOverlay;