//helper function for receiving and transforming database information

//comuns can be either renamed or omitted
type TransformOptions<T> = {
    omit?: (keyof T)[];
    rename?: Partial<Record<keyof T, string>>;
};

export function transformData<T extends Record<string, any>>(
    data: T[],
    options: TransformOptions<T> = {}
) {
    //data to omit passed as an array, data to rename passed as object
    const omit = options.omit ?? [];
    const rename: Partial<Record<keyof T, string>> = options.rename ?? {};

    //primary key for objects sometimes might not be in right order
    //for preventing that, numbering all the items, starting from 1
    return data.map((item, index) => {
        const result: Record<string, any> = {
            "#": index + 1,
        };

        // renaming or omitting each data member
        Object.entries(item).forEach(([key, value]) => {
            if (omit.includes(key as keyof T)) return;
            const newKey = rename[key as keyof T] ?? key;
            result[newKey] = value;
        });

        return result;
    });
}