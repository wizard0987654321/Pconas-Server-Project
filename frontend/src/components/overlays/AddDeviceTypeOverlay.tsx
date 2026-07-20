import AddOverlay from "./AddOverlay";

type AddDeviceTypeOverlayProps = {
    onClose: () => void;
};

function AddDeviceTypeOverlay({ onClose }:AddDeviceTypeOverlayProps) {


    return (
        <AddOverlay

            title="Add New Device Type"

            endpoint="/addDeviceType"

            onClose={onClose}


            fields={[
                {
                    name:"name",
                    label:"Type Name",
                    type: "text"
                },

                {
                    name:"manufacturer",
                    label:"Manufacturer",
                    type: "text"
                },

                {
                    name:"usage",
                    label:"Usage",
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