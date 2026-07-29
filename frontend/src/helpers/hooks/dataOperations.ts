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