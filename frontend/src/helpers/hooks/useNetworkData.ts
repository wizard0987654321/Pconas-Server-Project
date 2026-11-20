import { useMemo, useState } from "react";

import type { NetworkNode } from "../../types";
import { getNetworkNodesData } from "../../services/api";
import { usePolling, keepIfUnchanged } from "./usePolling";
import { POLL_INTERVAL_MS } from "./useRoomData";

// Network nodes of one room (customer, DNS, firewall, load balancer, nginx, server).
// Reloaded every few seconds, so trainer scenarios and trainee fixes show up live on both sides.
export function useNetworkData(roomId: number) {
    const [nodesData, setNodesData] = useState<NetworkNode[]>([]);

    // Also called after initializing the network or saving settings
    const reloadNetwork = () =>
        getNetworkNodesData()
            .then(nodes => setNodesData(keepIfUnchanged(nodes)))
            .catch((err) => console.error("Network API error", err));

    usePolling(reloadNetwork, POLL_INTERVAL_MS);

    const roomNetworkNodes = useMemo(() => nodesData.filter(node => node.RoomID === roomId), [nodesData, roomId]);

    return { roomNetworkNodes, reloadNetwork };
}
