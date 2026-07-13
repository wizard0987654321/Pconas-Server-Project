import PageHeading from "../components/PageHeading";
import ServerServices from "../components/ServerServices";

function ServicesPage() {
    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
            <PageHeading heading="pages.services.headingText" />
            <ServerServices />
        </div>
    )
}

export default ServicesPage;