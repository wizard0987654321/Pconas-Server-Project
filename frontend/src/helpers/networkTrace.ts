import type {
    NetworkNode, ClientConfig, DnsConfig, FirewallConfig, LoadBalancerConfig, ProxyConfig, ServerConfig,
} from "../types";

// Network training: follows one customer request through the settings of a room's network
// (no React, no API calls, same idea as powerFlow.ts).
//
// customer -> DNS -> firewall -> load balancer -> nginx proxy -> server
//
// Every part is checked in this order. The first part with a wrong setting stops the request,
// and its outcome is what the customer would see.

export type NetworkNodeType = NetworkNode["Type"];

// What the customer sees in the end
export type TraceOutcome = "OK" | "NXDOMAIN" | "TIMEOUT" | "503" | "502";

// One checked part of the chain
export type TraceStep = {
    node: NetworkNodeType;
    ok: boolean;
    detail: string; // what happened here, e.g. "shop.example.com -> 203.0.113.10"
};

export type Trace = {
    steps: TraceStep[];
    outcome: TraceOutcome;
};

// The request, given separately so several services per room can be traced later
export type NetworkRequest = ClientConfig;

// Settings of each part, read from the room's nodes. null if one part is missing (network not initialized)
type Chain = {
    dns: DnsConfig;
    firewall: FirewallConfig;
    loadBalancer: LoadBalancerConfig;
    proxy: ProxyConfig;
    server: ServerConfig;
};

// Which settings belong to which node type
type ConfigByType = {
    client: ClientConfig;
    dns: DnsConfig;
    firewall: FirewallConfig;
    loadBalancer: LoadBalancerConfig;
    proxy: ProxyConfig;
    server: ServerConfig;
};

// Settings of the node with this type (e.g. "dns" -> DnsConfig), undefined if missing.
// The cast is safe: the NetworkNode type ties each Type to its Config, TypeScript just can't follow it through the generic.
function configOf<T extends NetworkNodeType>(nodes: NetworkNode[], type: T) {
    return nodes.find(node => node.Type === type)?.Config as ConfigByType[T] | undefined;
}

function chainOf(nodes: NetworkNode[]): Chain | null {
    const dns = configOf(nodes, "dns");
    const firewall = configOf(nodes, "firewall");
    const loadBalancer = configOf(nodes, "loadBalancer");
    const proxy = configOf(nodes, "proxy");
    const server = configOf(nodes, "server");

    if (!dns || !firewall || !loadBalancer || !proxy || !server) return null;
    return { dns, firewall, loadBalancer, proxy, server };
}

// The customer's request of the room (from the "client" node), null if missing
export function requestOf(nodes: NetworkNode[]): NetworkRequest | null {
    return configOf(nodes, "client") ?? null;
}

// Follows the request through the room's network. null if the room has no complete network.
export function traceRequest(nodes: NetworkNode[], request: NetworkRequest): Trace | null {
    const chain = chainOf(nodes);
    if (!chain) return null;

    const { dns, firewall, loadBalancer, proxy, server } = chain;
    const steps: TraceStep[] = [];

    // pass: the request got through this part. fail: it stops here, returns the finished trace ("return fail(...)")
    const pass = (node: NetworkNodeType, detail: string) => { steps.push({ node, ok: true, detail }); };
    const fail = (node: NetworkNodeType, detail: string, outcome: TraceOutcome): Trace => {
        steps.push({ node, ok: false, detail });
        return { steps, outcome };
    };

    // 1. DNS: hostname -> IP. No record = the name doesn't exist.
    //    A record with a wrong IP sends the customer to an address where nothing answers.
    const record = dns.records.find(r => r.name === request.hostname);
    if (!record) {
        return fail("dns", `no record for ${request.hostname}`, "NXDOMAIN");
    }
    if (record.ip !== loadBalancer.ip) {
        return fail("dns", `${request.hostname} -> ${record.ip}, nothing answers at this address`, "TIMEOUT");
    }
    pass("dns", `${request.hostname} -> ${record.ip}`);

    // 2. Firewall: the first rule for the port decides, otherwise the default.
    //    Denied packets are silently dropped, so the customer waits until timeout.
    const rule = firewall.rules.find(r => r.port === request.port);
    const action = rule?.action ?? firewall.defaultAction;
    if (action === "deny") {
        return fail("firewall", `port ${request.port} denied (${rule ? "rule" : "default action"})`, "TIMEOUT");
    }
    pass("firewall", `port ${request.port} allowed (${rule ? "rule" : "default action"})`);

    // 3. Load balancer: sends only to healthy members.
    //    A member is healthy when nginx really is at its address and the health check path exists on the server.
    //    No healthy member = 503.
    const healthy = loadBalancer.members.filter(m =>
        m.ip === proxy.ip && m.port === proxy.port && loadBalancer.healthPath === server.healthPath
    );
    if (healthy.length === 0) {
        return fail("loadBalancer", `0 of ${loadBalancer.members.length} members healthy (health check ${loadBalancer.healthPath})`, "503");
    }
    pass("loadBalancer", `${healthy.length} of ${loadBalancer.members.length} members healthy, sent to ${healthy[0].ip}:${healthy[0].port}`);

    // 4. nginx: forwards to upstream. Nothing listening there = 502 Bad Gateway.
    if (proxy.upstreamIp !== server.ip || proxy.upstreamPort !== server.port) {
        return fail("proxy", `upstream ${proxy.upstreamIp}:${proxy.upstreamPort} not reachable`, "502");
    }
    pass("proxy", `forwarded to ${proxy.upstreamIp}:${proxy.upstreamPort}`);

    // 5. Server: answers (later steps add server-side faults here)
    pass("server", `answered on ${server.ip}:${server.port}`);

    return { steps, outcome: "OK" };
}
