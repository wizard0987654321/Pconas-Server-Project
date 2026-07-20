import { useData } from "./dataOperations";
import { getServicesData, deleteService } from "../../services/api";
import type { Service } from "../../types/index.ts";

export function useServices() {
    const {
        data: servicesData,
        loading,
        remove: deleteServiceById,
    } = useData<Service>({
        getData: getServicesData,
        deleteData: deleteService,
        getId: service => service.ID,
    });

    return {
        servicesData,
        loading,
        deleteService: deleteServiceById,
    };
}