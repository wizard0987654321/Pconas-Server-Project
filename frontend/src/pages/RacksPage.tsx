import ServerRacks from "../components/ServerRacks";
import PageHeading from "../components/PageHeading";
import { useParams } from "react-router-dom";

function RacksPage() {

    const { roomId } = useParams();
    
    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
                <PageHeading heading="Racks" />
                <ServerRacks roomId={roomId}/>
        </div>
    );
}

export default RacksPage;