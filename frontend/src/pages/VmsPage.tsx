import PageHeading from "../components/PageHeading";
import ServerVms from "../components/ServerVms";

function VmsPage() {
    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
            <PageHeading heading="pages.vms.headingText" />
            <ServerVms />
        </div>
    )
}

export default VmsPage;