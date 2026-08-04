import AddOverlay from "./generics/AddOverlay";
import { useTranslation } from "react-i18next";

type AddRoomOverlayProps = {
    onClose: () => void;
};

function AddRoomOverlay({ onClose }: AddRoomOverlayProps) {
    const { t } = useTranslation();

    return (
        <AddOverlay
            title={t("pages.rooms.form.title")}
            endpoint="/addRoom"
            onClose={onClose}

            fields={[
                {
                    name: "area",
                    label: t("pages.rooms.form.area"),
                    min: 0,
                    step: 0.01,
                },
                {
                    name: "capacity",
                    label: t("pages.rooms.form.capacity"),
                    min: 1,
                },
                {
                    name: "height",
                    label: t("pages.rooms.form.height"),
                    min: 0,
                    step: 0.01,
                },
            ]}

            transformData={(data) => ({
                newRoom: {
                    area: data.area,
                    capacity: data.capacity,
                    heightcm: data.height,
                }
            })}
        />
    );
}

export default AddRoomOverlay;