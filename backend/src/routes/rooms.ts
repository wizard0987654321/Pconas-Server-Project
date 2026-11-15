import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { toNumber } from "../helpers/parse";

const router = Router();

router.get("/rooms", async (req: Request, res: Response) => {
  const rooms = await prisma.room.findMany({ orderBy: { ID: "asc" } });

  // RoomNumber was ROW_NUMBER() OVER (ORDER BY ID) in the raw SQL — computed here instead.
  const result = rooms.map((room, index) => ({
    ID: room.ID,
    RoomNumber: index + 1,
    Area: room.Area,
    Capacity: room.Capacity,
    HeightCm: room.HeightCm !== null ? Number(room.HeightCm) : room.HeightCm,
  }));

  res.json(result);
});

router.post("/addRoom", async (req: Request, res: Response) => {
  const { newRoom } = req.body;

  try {
    // Every room gets its fixed outer power source (grid) in the same insert (atomic)
    await prisma.room.create({
      data: {
        Area: toNumber(newRoom.area),
        Capacity: toNumber(newRoom.capacity),
        HeightCm: toNumber(newRoom.heightcm),
        Equipment: { create: { Type: "grid" } },
      },
    });
    res.json({ message: "new Room added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new Room" });
  }
});

router.delete("/deleteRoom/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Connection FKs are NO ACTION (SQL Server forbids two cascading FKs to Equipment),
    // so the room's cables must be removed first, otherwise the cascade to Equipment fails
    const roomEquipment = { RoomID: Number(id) };

    await prisma.$transaction([
      prisma.connection.deleteMany({
        where: {
          OR: [{ FromEquipment: roomEquipment }, { ToEquipment: roomEquipment }],
        },
      }),
      prisma.room.delete({ where: { ID: Number(id) } }),
    ]);
    res.json({ message: "Room deleted successfully", id });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

export default router;
