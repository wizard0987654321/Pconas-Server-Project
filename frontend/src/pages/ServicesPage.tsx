import PageHeading from "../components/PageHeading";
import ServerServices from "../components/ServerServices";

function ServicesPage() {
    return (
        <div>
            <PageHeading heading="pages.services.headingText" />
            <ServerServices />
        </div>
    )
}

export default ServicesPage;