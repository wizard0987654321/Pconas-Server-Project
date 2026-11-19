import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { requireRole } from "../auth";

// Network training: the request chain of each room (customer, DNS, firewall, load balancer, nginx, server).

const router = Router();

// Working setup of one room. Every address points to the next part of the chain:
// customer asks DNS for the hostname -> load balancer IP, firewall lets port 443 in,
// load balancer -> nginx (10.0.1.10:80) -> server (10.0.2.20:8080), health check on /health
function defaultConfigs(serverDeviceId: number) {
  return {
    client: { hostname: "shop.example.com", port: 443 },
    dns: { records: [{ name: "shop.example.com", ip: "203.0.113.10" }] },
    firewall: { rules: [{ port: 443, action: "allow" }], defaultAction: "deny" },
    loadBalancer: { ip: "203.0.113.10", members: [{ ip: "10.0.1.10", port: 80 }], healthPath: "/health" },
    proxy: { ip: "10.0.1.10", port: 80, upstreamIp: "10.0.2.20", upstreamPort: 8080 },
    server: { deviceId: serverDeviceId, ip: "10.0.2.20", port: 8080, healthPath: "/health" },
  };
}

// All network nodes of all rooms, Config parsed from JSON.
// Baseline (the correct setup) is left out on purpose, otherwise the trainee could just compare.
router.get("/networkNodes", async (req: Request, res: Response) => {
  try {
    const nodes = await prisma.networkNode.findMany({
      select: { ID: true, RoomID: true, Type: true, Config: true },
      orderBy: { ID: "asc" },
    });

    res.json(nodes.map((node) => ({ ...node, Config: JSON.parse(node.Config) })));
  } catch (error) {
    console.error("Get network nodes error:", error);
    res.status(500).json({ error: "Failed to get network nodes" });
  }
});

// Creates the 6 nodes of a room with the working setup (Config = Baseline).
// The server is the first device in the room's racks that is not an in-rack UPS.
router.post("/initNetwork/:roomId", requireRole("trainer"), async (req: Request, res: Response) => {
  const roomId = Number(req.params.roomId);

  try {
    const device = await prisma.device.findFirst({
      where: { Rack: { Equipment: { RoomID: roomId } }, DeviceType: { IsUps: false } },
      orderBy: { ID: "asc" },
    });

    if (!device) {
      res.status(400).json({ error: "The room has no device that can be the server" });
      return;
    }

    const data = Object.entries(defaultConfigs(device.ID)).map(([type, config]) => {
      const json = JSON.stringify(config);
      return { RoomID: roomId, Type: type, Config: json, Baseline: json };
    });

    // One insert statement, so either all 6 nodes are created or none
    await prisma.networkNode.createMany({ data });
    res.json({ message: "Network initialized" });
  } catch (error: any) {
    // P2002 = UQ_NetworkNode_RoomType (room already has its network)
    if (error?.code === "P2002") {
      res.status(409).json({ error: "Network of this room already exists" });
      return;
    }
    console.error("Init network error:", error);
    res.status(500).json({ error: "Failed to initialize network" });
  }
});

export default router;
