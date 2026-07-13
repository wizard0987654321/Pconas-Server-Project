import PageHeading from "../components/PageHeading";
import ServerDevices from "../components/ServerDevices";

function DevicesPage() {
    return (
        <div>
            <PageHeading heading="pages.devices.headingText" />
            <ServerDevices />
        </div>
    )
}

export default DevicesPage;