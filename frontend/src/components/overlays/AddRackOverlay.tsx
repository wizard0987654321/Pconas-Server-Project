import { useRooms } from "../../helpers/hooks/roomOperations";
import AddOverlay from "./AddOverlay";

type AddRackOverlayProps = {
    onClose: () => void;
};

function AddRackOverlay({ onClose }:AddRackOverlayProps) {

    const { roomsData } = useRooms();


    return (
        <AddOverlay

            title="Add New Rack"

            endpoint="/addRack"

            onClose={onClose}


            fields={[
                {
                    name:"roomId",
                    label:"Room",
                    options: roomsData.map((room,index)=>({
                        value: room.ID,
                        label:`Room ${index+1}`
                    }))
                },

                {
                    name:"unitsSize",
                    label:"Size in units (U)",
                    min:1
                },

                {
                    name:"height",
                    label:"Height (cm)",
                    min:0,
                    step:0.01
                }
            ]}


            transformData={(data)=>({
                newRack:{
                    roomId:data.roomId,
                    unitsSize:data.unitsSize,
                    heightcm:data.height
                }
            })}

        />
    );
}

export default AddRackOverlay;