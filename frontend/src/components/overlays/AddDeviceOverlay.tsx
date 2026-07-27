import AddOverlay from "./AddOverlay";
import { useRacks } from "../../helpers/hooks/rackOperations";
import { useDeviceTypes } from "../../helpers/hooks/deviceTypeOperations";
import { useDevice } from "../../helpers/hooks/deviceOperations";
import { useTranslation } from "react-i18next";

type AddDeviceOverlayProps = {
    onClose: () => void,
    rackId?: number | null;
};

function AddDeviceOverlay({ onClose, rackId }: AddDeviceOverlayProps) {
    const { t } = useTranslation();
    const { racksData } = useRacks();
    const { deviceTypesData } = useDeviceTypes();
    const { deviceData } = useDevice();


    return (
        <AddOverlay
            title={t("pages.devices.form.title")}
            endpoint="/addDevice"
            onClose={onClose}
            initialData={rackId != null ? { rackId: String(rackId) } : undefined}
            validate={(data) => {
                const selectedRackId = Number(data.rackId);
                const selectedRack = racksData.find(rack => rack.ID == selectedRackId);
                const positionFrom = Number(data.positionFrom);
                const positionTo = Number(data.positionTo);

                if (!selectedRackId) {
                    return t("pages.devices.form.validation.noRackSelected");
                }

                if (positionFrom > positionTo) {
                    return t("pages.devices.form.validation.positionOrder");
                }

                if (selectedRack) {
                    if (positionFrom >= selectedRack.UnitsSize) {
                        return t("pages.devices.form.validation.positionFromTooLarge", { size: selectedRack.UnitsSize })
                    }

                    if (positionTo > selectedRack.UnitsSize) {
                        return t("pages.devices.form.validation.positionToTooLarge", { size: selectedRack.UnitsSize })
                    }
                }

            
                

                const overlapsExistingDevice = deviceData.some(
                    device =>
                        device.RackID === selectedRackId &&
                        positionFrom <= device.PositionTo &&
                        positionTo >= device.PositionFrom 
                );

                if (overlapsExistingDevice) {
                    return t("pages.devices.form.validation.overlap");
                }

                return null;
            }}
            fields={[
                ...(rackId == null
                    ? [{
                        name: "rackId",
                        label: t("pages.devices.form.rack"),
                        options: racksData.map((rack, index) => ({
                            value: rack.ID,
                            label: t("pages.devices.form.selectRack", { number: index + 1 })
                        }))
                    }]
                    : []),
                {
                    name: "internalId",
                    label: t("pages.devices.form.internalId"),
                    type: "text",
                },
                {
                    name: "positionFrom",
                    label: t("pages.devices.form.positionFrom"),
                    min: 1,
                },
                {
                    name: "positionTo",
                    label: t("pages.devices.form.positionTo"),
                    min: 1,
                },
                {
                    name: "electricityConnected",
                    label: t("pages.devices.form.electricityConnected"),
                    options: [
                        { value: "true", label: t("pages.devices.form.yes") },
                        { value: "false", label: t("pages.devices.form.no") },
                    ],
                },
                {
                    name: "torConnected",
                    label: t("pages.devices.form.torConnected"),
                    options: [
                        { value: "true", label: t("pages.devices.form.yes") },
                        { value: "false", label: t("pages.devices.form.no") },
                    ],
                },
                {
                    name: "typeId",
                    label: t("pages.devices.form.deviceType"),
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