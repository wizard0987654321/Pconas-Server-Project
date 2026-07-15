import PageHeading from "../components/PageHeading";
import ServerDeviceTypes from "../components/ServerDeviceTypes";


function DeviceTypesPage() {
    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
            <PageHeading heading="pages.deviceTypes.headingText" />
            <ServerDeviceTypes />
        </div>
    )
}

export default DeviceTypesPage;