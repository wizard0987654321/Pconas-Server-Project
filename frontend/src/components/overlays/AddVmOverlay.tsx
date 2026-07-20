import AddOverlay from "./AddOverlay";
import { useDevice } from "../../helpers/hooks/deviceOperations";
import { useServices } from "../../helpers/hooks/serviceOperations";

type AddVmOverlayProps = {
    onClose: () => void;
};

function AddVmOverlay({ onClose }: AddVmOverlayProps) {
    const { deviceData } = useDevice();
    const { servicesData } = useServices();

    return (
        <AddOverlay
            title="Add New VM"
            endpoint="/addVm"
            onClose={onClose}
            fields={[
                {
                    name: "name",
                    label: "VM Name",
                    type: "text",
                },
                {
                    name: "deviceId",
                    label: "Device",
                    options: deviceData.map((device) => ({
                        value: device.ID,
                        label: device.InternalID ? `${device.InternalID} (ID ${device.ID})` : `Device ${device.ID}`,
                    })),
                },
                {
                    name: "serviceId",
                    label: "Service",
                    options: servicesData.map((service) => ({
                        value: service.ID,
                        label: service.Name,
                    })),
                },
            ]}
            transformData={(data) => ({
                newVm: {
                    name: data.name,
                    deviceId: Number(data.deviceId),
                    serviceId: Number(data.serviceId),
                },
            })}
        />
    );
}

export default AddVmOverlay;