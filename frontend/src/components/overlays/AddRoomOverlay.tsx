import AddOverlay from "./AddOverlay";

type AddRoomOverlayProps = {
    onClose: () => void;
};

function AddRoomOverlay({ onClose }: AddRoomOverlayProps) {

    return (
        <AddOverlay
            title="Add New Room"
            endpoint="/addRoom"
            onClose={onClose}

            fields={[
                {
                    name: "area",
                    label: "Area (m²)",
                    min: 0,
                    step: 0.01,
                },
                {
                    name: "capacity",
                    label: "Capacity",
                    min: 1,
                },
                {
                    name: "height",
                    label: "Height (cm)",
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