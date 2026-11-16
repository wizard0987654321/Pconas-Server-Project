import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { toNumber } from "../helpers/parse";
import { getRoomNumberById } from "../helpers/roomNumbers";

// Racks, UPS, PDUs and power sources. All of them are Equipment rows (ID shared with the child table),
// their RoomID lives on the parent Equipment row.

const router = Router();

router.get("/racks", async (req: Request, res: Response) => {
  const [roomNumberByRoomId, rackEquipment] = await Promise.all([
    getRoomNumberById(),
    prisma.equipment.findMany({
      where: { Type: "rack", Rack: { isNot: null } },
      include: { Rack: true },
      orderBy: { ID: "asc" },
    }),
  ]);

  const result = rackEquipment.map((equipment, index) => ({
    ID: equipment.ID,
    RackNumber: index + 1,
    RoomID: equipment.RoomID,
    UnitsSize: equipment.Rack!.UnitsSize,
    HeightCm: equipment.Rack!.HeightCm !== null ? Number(equipment.Rack!.HeightCm) : null,
    RoomNumber: roomNumberByRoomId.get(equipment.RoomID),
  }));

  res.json(result);
});

router.get("/ups", async (req: Request, res: Response) => {
  const [roomNumberByRoomId, upsEquipment] = await Promise.all([
    getRoomNumberById(),
    prisma.equipment.findMany({
      where: { Type: "ups", UPS: { isNot: null } },
      include: { UPS: true },
      orderBy: { ID: "asc" },
    }),
  ]);

  const result = upsEquipment.map((equipment, index) => ({
    ID: equipment.ID,
    UPSNumber: index + 1,
    RoomID: equipment.RoomID,
    UnitsSize: equipment.UPS!.UnitsSize,
    HeightCm: equipment.UPS!.HeightCm !== null ? Number(equipment.UPS!.HeightCm) : null,
    RoomNumber: roomNumberByRoomId.get(equipment.RoomID),
  }));

  res.json(result);
});

router.get("/pdus", async (req: Request, res: Response) => {
  const [roomNumberByRoomId, pduEquipment] = await Promise.all([
    getRoomNumberById(),
    prisma.equipment.findMany({
      where: { Type: "pdu", PDU: { isNot: null } },
      include: { PDU: true },
      orderBy: { ID: "asc" },
    }),
  ]);

  const result = pduEquipment.map((equipment, index) => ({
    ID: equipment.ID,
    PDUNumber: index + 1,
    RoomID: equipment.RoomID,
    OutletCount: equipment.PDU!.OutletCount,
    RoomNumber: roomNumberByRoomId.get(equipment.RoomID),
  }));

  res.json(result);
});

// Power sources of every room: the fixed outer grid (one per room) and emergency generators (max two per room).
// They have no child table, only ID and Type are needed so cables can start from them.
router.get("/powerSources", async (req: Request, res: Response) => {
  try {
    const powerSources = await prisma.equipment.findMany({
      where: { Type: { in: ["grid", "generator"] } },
      select: { ID: true, RoomID: true, Type: true },
      orderBy: { ID: "asc" },
    });
    res.json(powerSources);
  } catch (error) {
    console.error("Get power sources error:", error);
    res.status(500).json({ error: "Failed to get power sources" });
  }
});

// Fans of every room (stand left / right of the grid, no cables)
router.get("/fans", async (req: Request, res: Response) => {
  try {
    const fans = await prisma.equipment.findMany({
      where: { Type: "fan" },
      select: { ID: true, RoomID: true },
      orderBy: { ID: "asc" },
    });
    res.json(fans);
  } catch (error) {
    console.error("Get fans error:", error);
    res.status(500).json({ error: "Failed to get fans" });
  }
});

// Generator or fan in one of the two places left / right of the grid (max two per room, both types together).
// A generator is only allowed while the room's grid is damaged.
// Body: { roomId, type: "generator" | "fan" }
router.post("/addOutsideEquipment", async (req: Request, res: Response) => {
  const roomId = toNumber(req.body.roomId);
  const type = req.body.type;

  if (!roomId || (type !== "generator" && type !== "fan")) {
    res.status(400).json({ error: "Room or type is missing" });
    return;
  }

  try {
    const [gridFault, usedPlaces] = await Promise.all([
      prisma.fault.findFirst({
        where: { ResolvedAt: null, FaultType: "damaged", Equipment: { RoomID: roomId, Type: "grid" } },
      }),
      prisma.equipment.count({ where: { RoomID: roomId, Type: { in: ["generator", "fan"] } } }),
    ]);

    if (type === "generator" && !gridFault) {
      res.status(409).json({ error: "A generator can only be added while the power grid is down" });
      return;
    }
    if (usedPlaces >= 2) {
      res.status(409).json({ error: "Both places are already taken" });
      return;
    }

    await prisma.equipment.create({ data: { RoomID: roomId, Type: type } });
    res.json({ message: `${type} added` });
  } catch (error) {
    console.error("Add outside equipment error:", error);
    res.status(500).json({ error: "Failed to add equipment" });
  }
});

// Removes one generator or fan from the outside slots (trainer or trainee). Cables first
// (Connection FKs are NO ACTION, fans have none), then the Equipment row, its faults are removed by the cascade.
router.delete("/deleteOutsideEquipment/:id", async (req: Request, res: Response) => {
  const equipmentId = Number(req.params.id);

  try {
    const equipment = await prisma.equipment.findFirst({
      where: { ID: equipmentId, Type: { in: ["generator", "fan"] } },
    });

    if (!equipment) {
      res.status(404).json({ error: "Generator or fan not found" });
      return;
    }

    await prisma.$transaction([
      prisma.connection.deleteMany({
        where: { OR: [{ FromEquipmentID: equipmentId }, { ToEquipmentID: equipmentId }] },
      }),
      prisma.equipment.delete({ where: { ID: equipmentId } }),
    ]);
    res.json({ message: "Equipment deleted" });
  } catch (error) {
    console.error("Delete outside equipment error:", error);
    res.status(500).json({ error: "Failed to delete equipment" });
  }
});

router.post("/addRack", async (req: Request, res: Response) => {
  const { newRack } = req.body;

  try {
    // Parent Equipment row + Rack child row are created together (atomic), same as UPS
    await prisma.equipment.create({
      data: {
        RoomID: toNumber(newRack.roomId) as number,
        Type: "rack",
        Rack: {
          create: {
            UnitsSize: toNumber(newRack.unitsSize),
            HeightCm: toNumber(newRack.heightcm),
          },
        },
      },
    });
    res.json({ message: "new Rack added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new Rack" });
  }
});

router.post("/addUPS", async (req: Request, res: Response) => {
  const { newUPS } = req.body;

  try {
    // Parent Equipment row + UPS child row are created together (atomic)
    await prisma.equipment.create({
      data: {
        RoomID: toNumber(newUPS.roomId) as number,
        Type: "ups",
        UPS: {
          create: {
            UnitsSize: toNumber(newUPS.unitsSize),
            HeightCm: toNumber(newUPS.heightcm),
          },
        },
      },
    });
    res.json({ message: "new UPS added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new UPS" });
  }
});

router.delete("/deleteRack/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const rackId = Number(id);

    // Cables first (Connection FKs are NO ACTION), then the Equipment row.
    // Deleting Equipment cascades to Rack -> its Devices -> their VMs
    await prisma.$transaction([
      prisma.connection.deleteMany({
        where: { OR: [{ FromEquipmentID: rackId }, { ToEquipmentID: rackId }] },
      }),
      prisma.equipment.delete({ where: { ID: rackId } }),
    ]);
    res.json({ message: "Rack deleted successfully", id });
  } catch (error) {
    console.error("Delete rack error:", error);
    res.status(500).json({ error: "Failed to delete rack" });
  }
});

export default router;
