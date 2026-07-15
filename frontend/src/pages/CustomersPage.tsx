import PageHeading from "../components/PageHeading";
import ServerCustomers from "../components/ServerCustomers";

function CustomersPage() {
    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
            <PageHeading heading="pages.customers.headingText" />
            <ServerCustomers />
        </div>
    )
}

export default CustomersPage;