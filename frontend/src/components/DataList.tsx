function DataList() {
    const rows = [
        {
            title: "erti ori sami",
            age: 28,
            profession: "sport",
        },
        {
            title: "otxi xuti ekvsi",
            age: 34,
            profession: "designer",
        },
        {
            title: "shvidi rva",
            age: 41,
            profession: "teacher",
        },
    ];

    return (
        <div className="w-full sm:w-[45vw] lg:w-[55vw] xl:w-[60vw] rounded-xl p-3 sm:p-8 lg:p-10 font-mono">
            {/* Desktop Header */}
            <div className="hidden sm:grid grid-cols-[2fr_1fr_2fr] font-semibold text-lg lg:text-xl border-b-2 border-[#6ADBAF] dark:border-[#3f8c6f]/50 pb-4 mb-3">
                <span>Title</span>
                <span>Age</span>
                <span>Profession</span>
            </div>

            <div className="space-y-3 sm:space-y-0">
                {rows.map((row, index) => (
                    <div key={index}>
                        {/* Mobile Card */}
                        <div className="sm:hidden rounded-lg border-3 border-[#6ADBAF] md:border-6 p-4 space-y-2 bg-white">
                            <div className="flex justify-between">
                                <span className="font-bold text-[#6ADBAF]">Title</span>
                                <span>{row.title}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-bold text-[#6ADBAF]">Age</span>
                                <span>{row.age}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-bold text-[#6ADBAF]">Profession</span>
                                <span>{row.profession}</span>
                            </div>
                        </div>

                        {/* Desktop Row */}
                        <div className="hidden sm:grid grid-cols-[2fr_1fr_2fr] py-5 lg:py-6 text-lg lg:text-xl border-b-2 border-[#6ADBAF] dark:border-gray-700 hover:bg-[#6ADBAF]/10 transition-colors">
                            <span>{row.title}</span>
                            <span>{row.age}</span>
                            <span>{row.profession}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DataList;