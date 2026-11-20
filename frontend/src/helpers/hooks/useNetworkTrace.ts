import { useMemo } from "react";

import type { NetworkNode } from "../../types";
import { requestOf, traceRequest } from "../networkTrace";

// The customer's request of the room and where it gets stuck.
// `nodes` must be memoized by the caller, then this only recalculates when settings really change.
// Both are null while the room has no (complete) network.
export function useNetworkTrace(nodes: NetworkNode[]) {
    return useMemo(() => {
        const request = requestOf(nodes);
        const trace = request ? traceRequest(nodes, request) : null;
        return { request, trace };
    }, [nodes]);
}
