export type RoomLayer = "power" | "network";

interface LayerToggleProps {
    layer: RoomLayer;
    onChange: (layer: RoomLayer) => void;
    t: (key: string) => string;
}

// Switch of the detailed room view: power simulation or network simulation
function LayerToggle({ layer, onChange, t }: LayerToggleProps) {
    const buttonClass = (active: boolean) =>
        `cursor-pointer px-4 py-2 font-semibold ${active ? "bg-[#6ADBAF] text-white" : ""}`;

    return (
        <div className="flex w-fit overflow-hidden rounded-[0.5rem] border-2 border-[#6ADBAF]">
            <button onClick={() => onChange("power")} className={buttonClass(layer === "power")}>
                {t("pages.rooms.detailedView.network.layerPower")}
            </button>
            <button onClick={() => onChange("network")} className={buttonClass(layer === "network")}>
                {t("pages.rooms.detailedView.network.layerNetwork")}
            </button>
        </div>
    );
}

export default LayerToggle;
