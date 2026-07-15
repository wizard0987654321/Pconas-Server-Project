import DataList from "../DataList";
import { useEffect, useState, useMemo } from "react";
import { getCustomersData } from "../../services/api";
import type { Customer } from "../../types";
import { transformData } from "../../helpers/transformData";

function ServerCustomers() {

    const [customersData, setCustomersData] = useState<Customer[]>([]);

    useEffect(() => {
        getCustomersData()
            .then((data) => {
                setCustomersData(data);
            })
            .catch((err) => {
                console.error("API error", err);
            });
    }, []);

    const displayData = useMemo(
        () =>
            transformData(customersData, {
                omit: ["ID"],
                rename: {
                    PhoneNumber: "pages.customers.data.number"
                },
            }),
        [customersData]
    );

    return (
        <>
            <DataList data={displayData} />
        </>
    );
}

export default ServerCustomers;