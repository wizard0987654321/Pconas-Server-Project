import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { requireRole } from "../auth";
import { toNumber } from "../helpers/parse";

// Faults caused by the trainer (damaged equipment or cables).
// Reading is allowed for everyone logged in, changing only for trainers.

const router = Router();

// Active faults (ResolvedAt is null) of all rooms, flattened for the frontend.
// RoomID comes from the damaged equipment, or for a cable from its "from" side (same as GET /connections).
router.get("/faults", async (req: Request, res: Response) => {
  try {
    const faults = await prisma.fault.findMany({
      where: { ResolvedAt: null },
      include: {
        Equipment: { select: { RoomID: true } },
        Connection: { select: { FromEquipment: { select: { RoomID: true } } } },
      },
      orderBy: { ID: "asc" },
    });

    const result = faults.map((f) => ({
      ID: f.ID,
      // CK_Fault_Target guarantees exactly one of both is set
      RoomID: f.Equipment?.RoomID ?? f.Connection?.FromEquipment.RoomID,
      EquipmentID: f.EquipmentID,
      ConnectionID: f.ConnectionID,
      FaultType: f.FaultType,
      StartedAt: f.StartedAt,
      ResolvedAt: f.ResolvedAt,
    }));

    res.json(result);
  } catch (error) {
    console.error("Get faults error:", error);
    res.status(500).json({ error: "Failed to get faults" });
  }
});

// Damage one piece of equipment or one cable.
// Body: { equipmentId } or { connectionId } (exactly one of them)
router.post("/addFault", requireRole("trainer"), async (req: Request, res: Response) => {
  const equipmentId = toNumber(req.body.equipmentId) ?? null;
  const connectionId = toNumber(req.body.connectionId) ?? null;

  if ((equipmentId === null) === (connectionId === null)) {
    res.status(400).json({ error: "Give either equipmentId or connectionId" });
    return;
  }

  try {
    await prisma.fault.create({
      data: { EquipmentID: equipmentId, ConnectionID: connectionId, FaultType: "damaged" },
    });
    res.json({ message: "Fault added" });
  } catch (error: any) {
    // P2002 = unique index (already damaged), P2003 = foreign key (equipment / cable doesn't exist)
    if (error?.code === "P2002") {
      res.status(409).json({ error: "Already damaged" });
      return;
    }
    if (error?.code === "P2003") {
      res.status(400).json({ error: "Unknown equipment or cable" });
      return;
    }
    console.error("Add fault error:", error);
    res.status(500).json({ error: "Failed to add fault" });
  }
});

// Repair: marks one active fault as resolved.
// The time comes from the DB clock (same as StartedAt), so ResolvedAt >= StartedAt always holds.
router.put("/resolveFault/:id", requireRole("trainer"), async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const updated = await prisma.$executeRaw`
      UPDATE dbo.Fault SET ResolvedAt = SYSUTCDATETIME()
      WHERE ID = ${id} AND ResolvedAt IS NULL`;

    if (updated === 0) {
      res.status(404).json({ error: "No active fault with this ID" });
      return;
    }
    res.json({ message: "Fault resolved" });
  } catch (error) {
    console.error("Resolve fault error:", error);
    res.status(500).json({ error: "Failed to resolve fault" });
  }
});

// Reset: resolves all active faults of one room (equipment faults + cable faults)
router.put("/resetFaults/:roomId", requireRole("trainer"), async (req: Request, res: Response) => {
  const roomId = Number(req.params.roomId);

  try {
    const updated = await prisma.$executeRaw`
      UPDATE f SET ResolvedAt = SYSUTCDATETIME()
      FROM dbo.Fault f
      LEFT JOIN dbo.Equipment e   ON e.ID = f.EquipmentID
      LEFT JOIN dbo.[Connection] c ON c.ID = f.ConnectionID
      LEFT JOIN dbo.Equipment ce  ON ce.ID = c.FromEquipmentID
      WHERE f.ResolvedAt IS NULL AND (e.RoomID = ${roomId} OR ce.RoomID = ${roomId})`;

    res.json({ message: "Faults reset", count: updated });
  } catch (error) {
    console.error("Reset faults error:", error);
    res.status(500).json({ error: "Failed to reset faults" });
  }
});

export default router;
