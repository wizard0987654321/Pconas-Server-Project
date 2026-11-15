import { Router, Request, Response } from "express";
import { prisma } from "../db";

// Faults caused by the trainer (damaged equipment or cables).
// Trainer actions (damage / repair / reset) will be added here in the next steps.

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

export default router;
