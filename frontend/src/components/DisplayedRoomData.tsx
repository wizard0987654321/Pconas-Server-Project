function DisplayedRoomData() {
    return (
        <div className="grid w-full grid-cols-2 gap-6 rounded-lg bg-[#6ADBAF]/10 p-4 text-center md:grid-cols-4">

            <div className="flex flex-col items-center gap-1">
                <h2 className="text-sm font-semibold text-gray-600">W</h2>
                <p className="text-xl font-bold text-gray-900">--</p>
            </div>

            <div className="flex flex-col items-center gap-1">
                <h2 className="text-sm font-semibold text-gray-600">C</h2>
                <p className="text-xl font-bold text-gray-900">--</p>
            </div>

            <div className="flex flex-col items-center gap-1">
                <h2 className="text-sm font-semibold text-gray-600">Humidity</h2>
                <p className="text-xl font-bold text-gray-900">-- %</p>
            </div>

            <div className="flex flex-col items-center gap-1">
                <h2 className="text-sm font-semibold text-gray-600">UPS Battery</h2>
                <p className="text-xl font-bold text-gray-900">-- %</p>
            </div>

        </div>
    );
}

export default DisplayedRoomData;