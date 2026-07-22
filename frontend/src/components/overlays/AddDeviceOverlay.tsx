import AddOverlay from "./AddOverlay";
import { useRacks } from "../../helpers/hooks/rackOperations";
import { useDeviceTypes } from "../../helpers/hooks/deviceTypeOperations";
import { useDevice } from "../../helpers/hooks/deviceOperations";

type AddDeviceOverlayProps = {
    onClose: () => void;
};

function AddDeviceOverlay({ onClose }: AddDeviceOverlayProps) {
    const { racksData } = useRacks();
    const { deviceTypesData } = useDeviceTypes();
    const { deviceData } = useDevice();


    return (
        <AddOverlay
            title="Add New Device"
            endpoint="/addDevice"
            onClose={onClose}
            validate={(data) => {
                const selectedRackId = Number(data.rackId);
                const selectedRack = racksData.find(rack => rack.ID == selectedRackId);
                const positionFrom = Number(data.positionFrom);
                const positionTo = Number(data.positionTo);

                if (!selectedRackId) {
                    return "Please select a rack.";
                }

                if (positionFrom > positionTo) {
                    return "Position (From) must be less than or equal to Position (To).";
                }

                if (selectedRack) {
                    if (positionFrom >= selectedRack.UnitsSize) {
                        return `Position (From) must be less than total size (Units) of chosen rack, size - ${selectedRack.UnitsSize}`
                    }

                    if (positionTo > selectedRack.UnitsSize) {
                        return `Position (To) can not be more than total size (Units) of chosen rack, size - ${selectedRack.UnitsSize}`
                    }
                }

            
                

                const overlapsExistingDevice = deviceData.some(
                    device =>
                        device.RackID === selectedRackId &&
                        positionFrom <= device.PositionTo &&
                        positionTo >= device.PositionFrom 
                );

                if (overlapsExistingDevice) {
                    return "The selected device positions overlap with an existing device in this rack.";
                }

                return null;
            }}
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