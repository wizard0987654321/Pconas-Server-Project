/* ==========================================================================
 * BOOK THREAD 2.6.1  AddDeviceOverlay   (Chapter 2: Rooms)
 * File: src/components/overlays/AddDeviceOverlay.tsx
 *
 * Form to add a device to a rack (positions, electricity, TOR, type).
 *
 * Used by: 2.6 DetailedRack, 5 DevicesPage
 * Uses: 2.5.3.1 inRackUps, A.7 AddOverlay, A.10.2 rackOperations, A.10.3 deviceTypeOperations,
 *   A.10.4 deviceOperations
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import AddOverlay from "./generics/AddOverlay"; // A.7 AddOverlay
import { useRacks } from "../../helpers/hooks/rackOperations"; // A.10.2 rackOperations
import { useDeviceTypes } from "../../helpers/hooks/deviceTypeOperations"; // A.10.3 deviceTypeOperations
import { useDevice } from "../../helpers/hooks/deviceOperations"; // A.10.4 deviceOperations
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { RACK_FEED, electricityOptions, electricityError, electricityFields } from "../../helpers/inRackUps"; // 2.5.3.1 inRackUps

type AddDeviceOverlayProps = {
    onClose: () => void,
    rackId?: number | null;
};

function AddDeviceOverlay({ onClose, rackId }: AddDeviceOverlayProps) {
    const { t } = useTranslation();
    const { racksData } = useRacks();
    const { deviceTypesData } = useDeviceTypes();
    const { deviceData } = useDevice();

    // Currently chosen rack, for the in-rack UPS options of "Electricity"
    const [formRackId, setFormRackId] = useState<number | null>(rackId ?? null);

    return (
        <AddOverlay
            title={t("pages.devices.form.title")}
            endpoint="/addDevice"
            onClose={onClose}
            initialData={{ ...(rackId != null ? { rackId: String(rackId) } : {}), electricity: RACK_FEED }}
            onFieldChange={(name, value) => {
                if (name === "rackId") setFormRackId(Number(value) || null);
            }}
            validate={(data) => {
                const selectedRackId = Number(data.rackId);
                const selectedRack = racksData.find(rack => rack.ID == selectedRackId);
                const positionFrom = Number(data.positionFrom);
                const positionTo = Number(data.positionTo);

                {/* checking that device has free space to be mounted, position is not out of rack range*/}
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

                const typeIsUps = deviceTypesData.find(type => type.ID === Number(data.typeId))?.IsUps ?? false;
                const upsError = electricityError(deviceData, selectedRackId, typeIsUps, data.electricity); // 2.5.3.1 electricityError
                if (upsError) return t(upsError);

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
                    name: "electricity",
                    label: t("pages.devices.form.electricityConnected"),
                    options: electricityOptions(deviceData, formRackId, t),
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
                    ...electricityFields(data.electricity),
                    torConnected: data.torConnected === "true",
                },
            })}
        />
    );
}

export default AddDeviceOverlay;

// → Next in the book: 2.6.2 EditDeviceOverlay  (src/components/overlays/EditDeviceOverlay.tsx)
