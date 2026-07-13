type TransformOptions<T> = {
    omit?: (keyof T)[];
    rename?: Partial<Record<keyof T, string>>;
};

export function transformData<T extends Record<string, any>>(
    data: T[],
    options: TransformOptions<T> = {}
) {
    const omit = options.omit ?? [];
    const rename: Partial<Record<keyof T, string>> = options.rename ?? {};

    return data.map((item, index) => {
        const result: Record<string, any> = {
            "#": index + 1,
        };

        Object.entries(item).forEach(([key, value]) => {
            if (omit.includes(key as keyof T)) return;

            const newKey = rename[key as keyof T] ?? key;
            result[newKey] = value;
        });

        return result;
    });
}