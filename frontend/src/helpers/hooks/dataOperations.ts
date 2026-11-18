/* ==========================================================================
 * BOOK THREAD A.10  dataOperations   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/helpers/hooks/dataOperations.ts
 *
 * useData: generic loading + deleting of one table. The ...Operations hooks (A.10.1 - A.10.7) only configure
 * it per table.
 *
 * HOOK - only provides data / functions to the component that calls it, renders no HTML.
 *
 * Used by: A.10.1 roomOperations, A.10.2 rackOperations, A.10.3 deviceTypeOperations,
 *   A.10.4 deviceOperations, A.10.5 vmOperations, A.10.6 serviceOperations, A.10.7 customerOperations
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useEffect, useState } from "react";


//helper general function for custom hooks
//each page has its own custom hook
//custom hooks return getData, deleteData and findID functions for all db tables
type UseDataProps<T> = {
    getData: () => Promise<T[]>;
    deleteData: (id: number) => Promise<void>;
    getId: (item: T) => number;
};

// function receives 3 parameters, get corresponding data and returns 3 function that are needed
export function useData<T>({
    getData,
    deleteData,
    getId,
}: UseDataProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData()
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [getData]);

    const remove = async (id: number) => {
        try {
            await deleteData(id);

            setData(prev =>
                prev.filter(item => getId(item) !== id)
            );
        } catch (err) {
            console.error(err);
        }
    };

    return {
        data,
        loading,
        remove,
    };
}

// → Next in the book: A.10.1 roomOperations  (src/helpers/hooks/roomOperations.ts)
