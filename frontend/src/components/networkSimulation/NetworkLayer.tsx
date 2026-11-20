import { Fragment, useMemo, useRef, useState } from "react";

import type { Device, NetworkNode, Rack } from "../../types";
import { initNetwork } from "../../services/api";
import { useNetworkData } from "../../helpers/hooks/useNetworkData";
import { useEquipmentRefs, useConnectionLines, type LineInput } from "../../helpers/hooks/connectionLines";
import ConnectionLine from "../powerSimulation/ConnectionLine";
import serverIcon from "../../assets/ServerIcon.svg";

// Parts of the chain shown above the room, in request order. The server is shown inside the room (its rack)
const CHAIN_OUTSIDE: NetworkNode["Type"][] = ["client", "dns", "firewall", "loadBalancer", "proxy"];

const NETWORK_LINE_COLOR = "#3B82F6";

// Ref keys of the line nginx -> server rack. Both refs share one map, so the proxy gets a key
// that can't be a rack ID (Equipment IDs start at 1)
const PROXY_REF_KEY = 0;

interface NetworkLayerProps {
    roomId: number;
    racks: Rack[];
    devices: Device[];
    isTrainer: boolean;
    t: (key: string) => string;
}

// Network view of a room: the request chain above the room, the server's rack highlighted inside.
// Without a network yet: a message, trainers get a button to create it.
function NetworkLayer({ roomId, racks, devices, isTrainer, t }: NetworkLayerProps) {
    const { roomNetworkNodes, loaded, reloadNetwork } = useNetworkData(roomId);
    const [error, setError] = useState<string | null>(null);

    // Rack that holds the server device
    const serverNode = roomNetworkNodes.find(node => node.Type === "server");
    const serverRackId = serverNode?.Type === "server"
        ? devices.find(device => device.ID === serverNode.Config.deviceId)?.RackID
        : undefined;

    // One line: nginx down into the server's rack
    const { equipmentRefs, setEquipmentRef } = useEquipmentRefs();
    const linesContainerRef = useRef<HTMLDivElement | null>(null);
    const lineInputs = useMemo<LineInput[]>(
        () => serverRackId === undefined ? [] : [{ key: "proxy-server", fromId: PROXY_REF_KEY, toId: serverRackId, color: NETWORK_LINE_COLOR }],
        [serverRackId]
    );
    const lines = useConnectionLines(linesContainerRef, equipmentRefs, lineInputs, [roomNetworkNodes, racks]);

    const handleInit = async () => {
        setError(null);
        try {
            await initNetwork(roomId);
            reloadNetwork();
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    };

    if (!loaded) return null;

    if (roomNetworkNodes.length === 0) {
        return (
            <div className="flex flex-col items-start gap-3">
                <p>{t("pages.rooms.detailedView.network.notInitialized")}</p>
                {isTrainer && (
                    <button onClick={handleInit} className="cursor-pointer rounded-[0.5rem] bg-[#6ADBAF] px-4 py-2 font-semibold text-white">
                        {t("pages.rooms.detailedView.network.initButton")}
                    </button>
                )}
                {error && <p className="text-[#DC2626] dark:text-[#F87171]">{error}</p>}
            </div>
        );
    }

    return (
        <div ref={linesContainerRef} className="relative flex flex-col">
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                {lines.map(line => (
                    <ConnectionLine key={line.key} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} color={line.color} strokeWidth={3} />
                ))}
            </svg>

            {/* Outside the room: customer -> DNS -> firewall -> load balancer -> nginx */}
            <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
                {CHAIN_OUTSIDE.map((type, index) => (
                    <Fragment key={type}>
                        {index > 0 && <span className="text-xl font-bold">→</span>}
                        <div
                            ref={type === "proxy" ? setEquipmentRef(PROXY_REF_KEY) : undefined}
                            className="rounded-[0.5rem] border-2 border-[#6ADBAF] bg-[#F8FAFC] px-4 py-3 font-semibold dark:bg-[#0E1F48]"
                        >
                            {t(`pages.rooms.detailedView.network.nodes.${type}`)}
                        </div>
                    </Fragment>
                ))}
            </div>

            {/* The room: racks, the one with the server is highlighted */}
            <div className="mx-auto flex w-full xl:w-[70%] flex-wrap justify-center gap-4 rounded-[0.5rem] border-[1rem] border-[#6ADBAF] p-6">
                {racks.map(rack => (
                    <div key={rack.ID} className="flex flex-col items-center gap-1">
                        <img
                            ref={setEquipmentRef(rack.ID)}
                            src={serverIcon}
                            alt="Server Icon"
                            className={`rack-item ${rack.ID === serverRackId ? "rounded-lg ring-4 ring-[#3B82F6]" : "opacity-40"}`}
                        />
                        {rack.ID === serverRackId && (
                            <span className="font-semibold">{t("pages.rooms.detailedView.network.nodes.server")}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NetworkLayer;
