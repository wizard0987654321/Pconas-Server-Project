import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { toNumber } from "../helpers/parse";

const router = Router();

// Cables between two pieces of Equipment (grid / rack / ups / pdu), flattened for the frontend.
// RoomID is taken from the "from" side, both ends are expected to be in the same room.
router.get("/connections", async (req: Request, res: Response) => {
  try {
    const connections = await prisma.connection.findMany({
      orderBy: { ID: "asc" },
      include: {
        FromEquipment: true,
        ToEquipment: true,
        ConnectionType: true,
      },
    });

    const result = connections.map((c) => ({
      ID: c.ID,
      RoomID: c.FromEquipment.RoomID,
      FromEquipmentID: c.FromEquipmentID,
      FromType: c.FromEquipment.Type,
      ToEquipmentID: c.ToEquipmentID,
      ToType: c.ToEquipment.Type,
      TypeID: c.TypeID,
      TypeNameEN: c.ConnectionType.NameEN,
      TypeNameDE: c.ConnectionType.NameDE,
      Color: c.ConnectionType.Color,
    }));

    res.json(result);
  } catch (error) {
    console.error("Get connections error:", error);
    res.status(500).json({ error: "Failed to get connections" });
  }
});

// Saves several new cables at once (all or nothing).
// Body: { connections: [{ fromEquipmentId, toEquipmentId, typeId? }] }, typeId defaults to "Power"
router.post("/addConnections", async (req: Request, res: Response) => {
  const { connections } = req.body;

  if (!Array.isArray(connections) || connections.length === 0) {
    res.status(400).json({ error: "No connections provided" });
    return;
  }

  try {
    const powerType = await prisma.connectionType.findUnique({ where: { NameEN: "Power" } });

    const newConnections = connections.map((c: any) => ({
      FromEquipmentID: toNumber(c.fromEquipmentId) as number,
      ToEquipmentID: toNumber(c.toEquipmentId) as number,
      TypeID: (toNumber(c.typeId) ?? powerType?.ID) as number,
    }));

    // Load every equipment piece involved, to validate the cables
    const equipmentIds = [...new Set(newConnections.flatMap((c) => [c.FromEquipmentID, c.ToEquipmentID]))];
    const equipment = await prisma.equipment.findMany({ where: { ID: { in: equipmentIds } } });
    const equipmentById = new Map(equipment.map((e) => [e.ID, e]));

    for (const c of newConnections) {
      const from = equipmentById.get(c.FromEquipmentID);
      const to = equipmentById.get(c.ToEquipmentID);

      if (!from || !to || !c.TypeID) {
        res.status(400).json({ error: "Unknown equipment or connection type" });
        return;
      }
      if (from.RoomID !== to.RoomID) {
        res.status(400).json({ error: "Both ends of a cable must be in the same room" });
        return;
      }
      // Also covers connecting something to itself
      if (from.Type === to.Type) {
        res.status(400).json({ error: "A cable must connect two different equipment types" });
        return;
      }
      // Power only flows out of the grid, never into it
      if (to.Type === "grid") {
        res.status(400).json({ error: "The power source can only be the start of a cable" });
        return;
      }
      // Same rule as isAllowedCable in the frontend (helpers/powerFlow.ts)
      if (from.Type === "grid" && to.Type === "rack") {
        res.status(400).json({ error: "The power grid can't feed a rack directly, use a UPS or PDU in between" });
        return;
      }
    }

    await prisma.$transaction(
      newConnections.map((data) => prisma.connection.create({ data }))
    );

    res.json({ message: "Connections added", count: newConnections.length });
  } catch (error: any) {
    // P2002 = unique constraint UQ_Connection (same cable already exists)
    if (error?.code === "P2002") {
      res.status(409).json({ error: "Connection already exists" });
      return;
    }
    console.error("Add connections error:", error);
    res.status(500).json({ error: "Failed to add connections" });
  }
});

export default router;
