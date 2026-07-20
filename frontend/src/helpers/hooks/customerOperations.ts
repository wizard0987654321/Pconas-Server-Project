import { useData } from "./dataOperations";
import { getCustomersData, deleteCustomer } from "../../services/api";
import type { Customer } from "../../types/index.ts";

export function useCustomers() {
    const {
        data: customersData,
        loading,
        remove: deleteCustomerById,
    } = useData<Customer>({
        getData: getCustomersData,
        deleteData: deleteCustomer,
        getId: customer => customer.ID,
    });

    return {
        customersData,
        loading,
        deleteCustomer: deleteCustomerById,
    };
}