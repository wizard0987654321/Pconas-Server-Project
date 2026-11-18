/* ==========================================================================
 * BOOK THREAD A.11  transformData   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/helpers/transformData.ts
 *
 * Prepares rows for DataList (A.6): adds the "#" column, renames or hides columns.
 *
 * HELPER - plain functions / settings, no React, renders no HTML.
 *
 * Used by: 2.1 ServerRoomList, 3.1 ServerRacks, 4.1 ServerDeviceTypes, 5.1 ServerDevices, 6.1 ServerVms,
 *   7.1 ServerServices, 8.1 ServerCustomers
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

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

// → Next in the book: A.12 api/index  (src/services/api/index.ts)
