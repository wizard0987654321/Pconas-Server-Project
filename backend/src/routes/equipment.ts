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

// Fixed outer power source (utility grid) of every room: one Equipment row with Type 'grid' per room.
// Has no child table, only the ID is needed so cables can start from it.
router.get("/powerSources", async (req: Request, res: Response) => {
  try {
    const powerSources = await prisma.equipment.findMany({
      where: { Type: "grid" },
      select: { ID: true, RoomID: true },
      orderBy: { ID: "asc" },
    });
    res.json(powerSources);
  } catch (error) {
    console.error("Get power sources error:", error);
    res.status(500).json({ error: "Failed to get power sources" });
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
