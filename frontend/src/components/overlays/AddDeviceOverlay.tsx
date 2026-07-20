import AddOverlay from "./AddOverlay";
import { useRacks } from "../../helpers/hooks/rackOperations";
import { useDeviceTypes } from "../../helpers/hooks/deviceTypeOperations";

type AddDeviceOverlayProps = {
    onClose: () => void;
};

function AddDeviceOverlay({ onClose }: AddDeviceOverlayProps) {
    const { racksData } = useRacks();
    const { deviceTypesData } = useDeviceTypes();

    return (
        <AddOverlay
            title="Add New Device"
            endpoint="/addDevice"
            onClose={onClose}
            fields={[
                {
                    name: "rackId",
                    label: "Rack",
                    options: racksData.map((rack, index) => ({
                        value: rack.ID,
                        label: `Rack ${index + 1}`,
                    })),
                },
                {
                    name: "internalId",
                    label: "Internal ID",
                    type: "text",
                },
                {
                    name: "positionFrom",
                    label: "Position (From)",
                    min: 1,
                },
                {
                    name: "positionTo",
                    label: "Position (To)",
                    min: 1,
                },
                {
                    name: "electricityConnected",
                    label: "Electricity Connected",
                    options: [
                        { value: "true", label: "Yes" },
                        { value: "false", label: "No" },
                    ],
                },
                {
                    name: "torConnected",
                    label: "TOR Connected",
                    options: [
                        { value: "true", label: "Yes" },
                        { value: "false", label: "No" },
                    ],
                },
                {
                    name: "typeId",
                    label: "Device Type",
                    options: deviceTypesData.map((deviceType) => ({
                        value: deviceType.ID,
                        label: deviceType.TypeName,
                    })),
                },
            ]}
            transformData={(data) => ({
                newDevice: {
                    rackId: Number(data.rackId),
                    typeId: Number(data.typeId),
                    internalId: data.internalId,
                    positionFrom: Number(data.positionFrom),
                    positionTo: Number(data.positionTo),
                    electricityConnected: data.electricityConnected === "true",
                    torConnected: data.torConnected === "true",
                },
            })}
        />
    );
}

export default AddDeviceOverlay;