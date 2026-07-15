import PageHeading from "../components/PageHeading";
import ServerDevices from "../components/pageContents/ServerDevices";

function DevicesPage() {
    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
            <PageHeading heading="pages.devices.headingText" />
            <ServerDevices />
        </div>
    )
}

export default DevicesPage;