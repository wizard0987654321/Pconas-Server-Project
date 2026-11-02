import { useParams } from "react-router-dom";

function DetailedRoom() {
    const { id } = useParams();

    return (
        <h1>This is test detailed Room page. Room ID: {id}</h1>
    );
}

export default DetailedRoom;