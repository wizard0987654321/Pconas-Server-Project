/* ==========================================================================
 * BOOK THREAD 2.6.2  EditDeviceOverlay   (Chapter 2: Rooms)
 * File: src/components/overlays/EditDeviceOverlay.tsx
 *
 * Form to edit a device, opened by clicking the device in the rack.
 *
 * Used by: 2.6 DetailedRack
 * Uses: 2.5.3.1 inRackUps, A.8 EditOverlay, A.10.2 rackOperations, A.10.3 deviceTypeOperations,
 *   A.10.4 deviceOperations, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import EditOverlay from "./generics/EditOverlay"; // A.8 EditOverlay
import { useRacks } from "../../helpers/hooks/rackOperations"; // A.10.2 rackOperations
import { useDeviceTypes } from "../../helpers/hooks/deviceTypeOperations"; // A.10.3 deviceTypeOperations
import { useDevice } from "../../helpers/hooks/deviceOperations"; // A.10.4 deviceOperations
import { useTranslation } from "react-i18next";
import type { Device } from "../../types"; // A.13 types
import { useState } from "react";
import { electricityValue, electricityOptions, electricityError, electricityFields } from "../../helpers/inRackUps"; // 2.5.3.1 inRackUps

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

    // Currently chosen rack, for the in-rack UPS options of "Electricity"
    const [formRackId, setFormRackId] = useState<number>(device.RackID);

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
                electricity: electricityValue(device),
                torConnected: String(device.TORConnected),
                typeId: String(device.TypeID),
            }}
            onFieldChange={(name, value) => {
                if (name === "rackId") setFormRackId(Number(value));
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

                const typeIsUps = deviceTypesData.find(type => type.ID === Number(data.typeId))?.IsUps ?? false;
                const upsError = electricityError(deviceData, selectedRackId, typeIsUps, data.electricity); // 2.5.3.1 electricityError
                if (upsError) return t(upsError);

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
                    name: "electricity",
                    label: t("pages.devices.form.electricityConnected"),
                    options: electricityOptions(deviceData, formRackId, t, device.ID),
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
                    ...electricityFields(data.electricity),
                    torConnected:
                        data.torConnected === "true",
                },
            })}
        />
    );
}

export default EditDeviceOverlay;

// → Next in the book: 3 RacksPage  (src/pages/RacksPage.tsx)
