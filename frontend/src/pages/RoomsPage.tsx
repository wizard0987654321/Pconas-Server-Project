import PageHeading from "../components/PageHeading";
import ServerRoom from "../components/ServerRoom";

function RoomsPage() {
    return (
        <>
            <div className="flex flex-col items-center p-4">
                <PageHeading heading="pages.rooms.headingText" />
                <ServerRoom />
            </div>
        </>
    )
}

export default RoomsPage;