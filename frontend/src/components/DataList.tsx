import { useTranslation } from "react-i18next";

type DataListProps = {
    data: Record<string, any>[];
};

function DataList({ data }: DataListProps) {
    const { t } = useTranslation();

    if (!data.length) return null;

    const columns = Object.keys(data[0]);

    // To make List grid dynamic
    const gridStyle = {
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
    };

    return (
        <div className="w-full rounded-xl p-3 s:p-8 lg:p-10 font-mono">

            {/* Desktop Header */}
            <div
                className="hidden xl:grid font-semibold m:text-lg border-b-2 border-[#6ADBAF] pb-4 mb-3"
                style={gridStyle}
            >
                {columns.map((column) => (
                    <span key={column} className="px-3">
                        {column === "#" ? "#" : t(column)}
                    </span>
                ))}
            </div>


            <div className="space-y-3 xl:space-y-0">
                {data.map((row, index) => (
                    <div key={index}>

                        {/* Mobile */}
                        <div className="xl:hidden rounded-lg text-sm m:text-xl border-3 border-[#6ADBAF] p-4 space-y-2 bg-white">
                            {Object.entries(row).map(([key, value]) => (
                                <div key={key} className="flex items-center">
                                    <span className="p-2 font-bold text-[#6ADBAF] shrink-0">
                                        {key === "#" ? "#" : t(key)}
                                    </span>

                                    <span className="ml-auto text-right break-words">
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>


                        {/* Desktop */}
                        <div
                            className="hidden xl:grid py-5 m:text-lg border-b-2 border-[#6ADBAF]"
                            style={gridStyle}
                        >
                            {columns.map((column) => (
                                <span className="p-1" key={column}>
                                    {row[column]}
                                </span>
                            ))}
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}

export default DataList;