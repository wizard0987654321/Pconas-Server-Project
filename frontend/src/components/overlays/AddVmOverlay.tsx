import AddOverlay from "./AddOverlay";
import { useDevice } from "../../helpers/hooks/deviceOperations";
import { useServices } from "../../helpers/hooks/serviceOperations";
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
                    label: t("pages.vms.form.vmName"),
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