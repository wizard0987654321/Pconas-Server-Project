import { useTranslation } from "react-i18next";

import type { RoomClimate } from "../../helpers/roomClimate";

type DisplayedRoomDataProps = {
    climate: RoomClimate;
};

// Power usage, AC cooling load, temperature and humidity of the room (calculated, see helpers/roomClimate.ts)
function DisplayedRoomData({ climate }: DisplayedRoomDataProps) {
    const { t } = useTranslation();

    // AC at its limit or without power -> cooling and temperature red
    const overloaded = climate.coolingPercent > 100 || !climate.acPowered;

    const items = [
        { label: t("pages.rooms.detailedView.roomData.power"), value: `${Math.round(climate.itLoadW)} W` },
        {
            label: t("pages.rooms.detailedView.roomData.cooling"),
            value: climate.acPowered ? `${Math.round(climate.coolingPercent)} %` : t("pages.rooms.detailedView.roomData.acOff"),
            detail: `${(climate.itLoadW / 1000).toFixed(1)} / ${(climate.coolingCapacityW / 1000).toFixed(1)} kW`,
            alert: overloaded,
        },
        { label: t("pages.rooms.detailedView.roomData.temperature"), value: `${climate.temperatureC.toFixed(1)} °C`, alert: overloaded },
        { label: t("pages.rooms.detailedView.roomData.humidity"), value: `${Math.round(climate.humidityPercent)} %` },
    ];

    return (
        <div className="grid w-full grid-cols-2 gap-6 rounded-lg bg-[#6ADBAF]/10 p-4 text-center md:grid-cols-4">
            {items.map(item => (
                <div key={item.label} className="flex flex-col items-center gap-1">
                    <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">{item.label}</h2>
                    <p className={`text-xl font-bold ${item.alert ? "text-[#DC2626] dark:text-[#F87171]" : "text-gray-900 dark:text-[#F9FAFB]"}`}>{item.value}</p>
                    {item.detail && <p className="text-xs text-gray-600 dark:text-gray-300">{item.detail}</p>}
                </div>
            ))}
        </div>
    );
}

export default DisplayedRoomData;
