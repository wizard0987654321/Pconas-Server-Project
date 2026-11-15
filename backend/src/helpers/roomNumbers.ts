import { prisma } from "../db";

// Room ID -> displayed room number (1, 2, 3, ... ordered by ID),
// same numbering as RoomNumber in GET /rooms
export async function getRoomNumberById() {
  const rooms = await prisma.room.findMany({ orderBy: { ID: "asc" }, select: { ID: true } });
  return new Map(rooms.map((room, index) => [room.ID, index + 1]));
}
