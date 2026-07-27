import AddOverlay from "./AddOverlay";
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
                }
            ]}


            transformData={(data)=>({
                newDeviceType:{
                    typeName:data.name,
                    manufacturer:data.manufacturer,
                    usage:data.usage
                }
            })}

        />
    );
}

export default AddDeviceTypeOverlay;