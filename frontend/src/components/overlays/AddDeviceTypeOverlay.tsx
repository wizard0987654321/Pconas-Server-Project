/* ==========================================================================
 * BOOK THREAD 4.2  AddDeviceTypeOverlay   (Chapter 4: Device Types)
 * File: src/components/overlays/AddDeviceTypeOverlay.tsx
 *
 * Form to add a device type (name, manufacturer, usage, in-rack UPS yes / no).
 *
 * Used by: 4 DeviceTypesPage
 * Uses: A.7 AddOverlay
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import AddOverlay from "./generics/AddOverlay"; // A.7 AddOverlay
import { useTranslation } from "react-i18next";

type AddDeviceTypeOverlayProps = {
    onClose: () => void;
};

function AddDeviceTypeOverlay({ onClose }:AddDeviceTypeOverlayProps) {
    const { t } = useTranslation();


    return (
        <AddOverlay

            title={t("pages.deviceTypes.form.title")}

            endpoint="/addDeviceType"

            onClose={onClose}


            fields={[
                {
                    name:"name",
                    label:t("pages.deviceTypes.form.typeName"),
                    type: "text"
                },

                {
                    name:"manufacturer",
                    label:t("pages.deviceTypes.form.manufacturer"),
                    type: "text"
                },

                {
                    name:"usage",
                    label:t("pages.deviceTypes.form.usage"),
                    type: "text"
                },

                {
                    name:"isUps",
                    label:t("pages.deviceTypes.form.isUps"),
                    options: [
                        { value: "false", label: t("common.no") },
                        { value: "true", label: t("common.yes") },
                    ]
                }
            ]}

            initialData={{ isUps: "false" }}

            transformData={(data)=>({
                newDeviceType:{
                    typeName:data.name,
                    manufacturer:data.manufacturer,
                    usage:data.usage,
                    isUps: data.isUps === "true"
                }
            })}

        />
    );
}

export default AddDeviceTypeOverlay;

// → Next in the book: 5 DevicesPage  (src/pages/DevicesPage.tsx)
