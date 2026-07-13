import PageHeading from "../components/PageHeading";
import ServerVms from "../components/ServerVms";

function VmsPage() {
    return (
        <div>
            <PageHeading heading="pages.vms.headingText" />
            <ServerVms />
        </div>
    )
}

export default VmsPage;