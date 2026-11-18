/* ==========================================================================
 * BOOK THREAD 6.2  AddVmOverlay   (Chapter 6: VMs)
 * File: src/components/overlays/AddVmOverlay.tsx
 *
 * Form to add a VM (service, host device, name).
 *
 * Used by: 6 VmsPage
 * Uses: A.7 AddOverlay, A.10.4 deviceOperations, A.10.6 serviceOperations
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import AddOverlay from "./generics/AddOverlay"; // A.7 AddOverlay
import { useDevice } from "../../helpers/hooks/deviceOperations"; // A.10.4 deviceOperations
import { useServices } from "../../helpers/hooks/serviceOperations"; // A.10.6 serviceOperations
import { useTranslation } from "react-i18next";

type AddVmOverlayProps = {
    onClose: () => void;
};

function AddVmOverlay({ onClose }: AddVmOverlayProps) {
    const { t } = useTranslation();
    const { deviceData } = useDevice();
    const { servicesData } = useServices();

    return (
        <AddOverlay
            title={t("pages.vms.form.title")}
            endpoint="/addVm"
            onClose={onClose}
            fields={[
                {
                    name: "name",
                    label: t("pages.vms.form.title"),
                    type: "text",
                },
                {
                    name: "deviceId",
                    label: t("pages.vms.form.device"),
                    options: deviceData.map((device) => ({
                        value: device.ID,
                        label: device.InternalID ? `${device.InternalID} (ID ${device.ID})` : `${t("common.device")} ${device.ID}`,
                    })),
                },
                {
                    name: "serviceId",
                    label: t("pages.vms.form.service"),
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

// → Next in the book: 7 ServicesPage  (src/pages/ServicesPage.tsx)
