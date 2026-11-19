import { Router, Request, Response } from "express";
import { prisma } from "../db";

// Network training: the request chain of each room (customer, DNS, firewall, load balancer, nginx, server).

const router = Router();

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

export default router;
