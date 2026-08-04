import EditOverlay from "./EditOverlay";
import { useRacks } from "../../helpers/hooks/rackOperations";
import { useDeviceTypes } from "../../helpers/hooks/deviceTypeOperations";
import { useDevice } from "../../helpers/hooks/deviceOperations";
import { useTranslation } from "react-i18next";
import type { Device } from "../../types";

type EditDeviceOverlayProps = {
    device: Device;
    onClose: () => void;
};

function EditDeviceOverlay({
    device,
    onClose,
}: EditDeviceOverlayProps) {
    const { t } = useTranslation();

    const { racksData } = useRacks();
    const { deviceTypesData } = useDeviceTypes();
    const { deviceData } = useDevice();

    return (
        <EditOverlay
            title={t("pages.devices.form.title")}
            endpoint="/updateDevice"
            onClose={onClose}
            initialData={{
                id: String(device.ID),
                rackId: String(device.RackID),
                internalId: device.InternalID,
                positionFrom: String(device.PositionFrom),
                positionTo: String(device.PositionTo),
                electricityConnected: String(device.ElectricityConnected),
                torConnected: String(device.TORConnected),
                typeId: String(device.TypeID),
            }}
            validate={(data) => {
                const selectedRackId = Number(data.rackId);

                const selectedRack = racksData.find(
                    rack => rack.ID === selectedRackId
                );

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
                        return t(
                            "pages.devices.form.validation.positionFromTooLarge",
                            { size: selectedRack.UnitsSize }
                        );
                    }

                    if (positionTo > selectedRack.UnitsSize) {
                        return t(
                            "pages.devices.form.validation.positionToTooLarge",
                            { size: selectedRack.UnitsSize }
                        );
                    }
                }

                console.log("Currently editing device:", device);
                console.log("All devices:", deviceData);

                // Ignore the currently edited device
                const overlapsExistingDevice = deviceData.some(
                    d =>
                        d.ID !== device.ID &&
                        d.RackID === selectedRackId &&
                        positionFrom <= d.PositionTo &&
                        positionTo >= d.PositionFrom
                );

                if (overlapsExistingDevice) {
                    console.log(device.ID);
                    return t("pages.devices.form.validation.overlap");
                }

                return null;
            }}
            fields={[
                {
                    name: "rackId",
                    label: t("pages.devices.form.rack"),
                    options: racksData.map((rack, index) => ({
                        value: rack.ID,
                        label: t("pages.devices.form.selectRack", {
                            number: index + 1,
                        }),
                    })),
                },
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
                        {
                            value: "true",
                            label: t("pages.devices.form.yes"),
                        },
                        {
                            value: "false",
                            label: t("pages.devices.form.no"),
                        },
                    ],
                },
                {
                    name: "torConnected",
                    label: t("pages.devices.form.torConnected"),
                    options: [
                        {
                            value: "true",
                            label: t("pages.devices.form.yes"),
                        },
                        {
                            value: "false",
                            label: t("pages.devices.form.no"),
                        },
                    ],
                },
                {
                    name: "typeId",
                    label: t("pages.devices.form.deviceType"),
                    options: deviceTypesData.map(deviceType => ({
                        value: deviceType.ID,
                        label: deviceType.TypeName,
                    })),
                },
            ]}
            transformData={(data) => ({
                updatedDevice: {
                    id: Number(data.id),
                    rackId: Number(data.rackId),
                    typeId: Number(data.typeId),
                    internalId: data.internalId,
                    positionFrom: Number(data.positionFrom),
                    positionTo: Number(data.positionTo),
                    electricityConnected:
                        data.electricityConnected === "true",
                    torConnected:
                        data.torConnected === "true",
                },
            })}
        />
    );
}

export default EditDeviceOverlay;