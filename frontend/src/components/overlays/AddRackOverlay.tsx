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

            validate={(data) => {
                const selectedRoom = roomsData.find(
                    room => room.ID === Number(data.roomId)
                );

                if (!selectedRoom) {
                    return "Please select a room.";
                }

                if (Number(data.height) > selectedRoom.HeightCm) {
                    return `Rack height cannot be greater than the selected room height (${selectedRoom.HeightCm} cm).`;
                }

                return null;
            }}


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