type DataListProps = {
    data: Record<string, any>[];
};

function DataList({ data }: DataListProps) {
    if (!data.length) return null;

    const columns = Object.keys(data[0]);

    return (
        <div className="w-full sm:w-[45vw] lg:w-[55vw] xl:w-[60vw] rounded-xl p-3 sm:p-8 lg:p-10 font-mono">

            {/* Desktop Header */}
            <div className="hidden sm:grid grid-cols-[2fr_1fr_2fr] font-semibold text-lg lg:text-xl border-b-2 border-[#6ADBAF] pb-4 mb-3">
                {columns.map((column) => (
                    <span key={column}>
                        {column}
                    </span>
                ))}
            </div>


            <div className="space-y-3 sm:space-y-0">
                {data.map((row, index) => (
                    <div key={index}>

                        {/* Mobile */}
                        <div className="sm:hidden rounded-lg border-3 border-[#6ADBAF] p-4 space-y-2 bg-white">
                            {Object.entries(row).map(([key, value]) => (
                                <div 
                                    key={key}
                                    className="flex justify-between"
                                >
                                    <span className="font-bold text-[#6ADBAF]">
                                        {key}
                                    </span>

                                    <span>
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>


                        {/* Desktop */}
                        <div className="hidden sm:grid grid-cols-[2fr_1fr_2fr] py-5 text-lg border-b-2 border-[#6ADBAF]">
                            {columns.map((column) => (
                                <span key={column}>
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