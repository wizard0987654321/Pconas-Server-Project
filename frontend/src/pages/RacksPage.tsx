import ServerRacks from "../components/ServerRacks";
import PageHeading from "../components/PageHeading";

function RacksPage() {
    
    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
                <PageHeading heading="Racks" />
                <ServerRacks />
        </div>
    );
}

export default RacksPage;