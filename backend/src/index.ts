import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, prisma } from "./db";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Prisma validates argument types strictly at runtime (unlike the old raw
// SQL, which just interpolated values as literal text and let SQL Server
// coerce them). Frontend form values often arrive as strings even for
// numeric/boolean fields, so every create/update route below converts
// through these first.
const toNumber = (value: unknown): number | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};

const toBoolean = (value: unknown): boolean | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return value === "true" || value === "1";
  return Boolean(value);
};

// backend communication with database

app.get("/rooms", async (req: Request, res: Response) => {
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

app.get("/racks", async (req: Request, res: Response) => {
  const [rooms, allRacks] = await Promise.all([
    prisma.room.findMany({ orderBy: { ID: "asc" }, select: { ID: true } }),
    prisma.rack.findMany({ orderBy: { ID: "asc" } }),
  ]);

  const roomNumberByRoomId = new Map(rooms.map((room, index) => [room.ID, index + 1]));

  // Original query used an INNER JOIN, so a rack whose RoomID doesn't match
  // any room gets dropped entirely — replicated here before numbering, since
  // RackNumber in the original SQL is numbered over the already-joined rows.
  const joinedRacks = allRacks.filter(
    (rack) => rack.RoomID !== null && roomNumberByRoomId.has(rack.RoomID)
  );

  const result = joinedRacks.map((rack, index) => ({
    ID: rack.ID,
    RackNumber: index + 1,
    RoomID: rack.RoomID,
    UnitsSize: rack.UnitsSize,
    HeightCm: rack.HeightCm !== null ? Number(rack.HeightCm) : rack.HeightCm,
    RoomNumber: roomNumberByRoomId.get(rack.RoomID as number),
  }));

  res.json(result);
});

app.get("/deviceTypes", async (req: Request, res: Response) => {
  const deviceTypes = await prisma.deviceType.findMany();
  res.json(deviceTypes);
});

app.get("/devices", async (req: Request, res: Response) => {
  // TypeID is nullable but the original query INNER JOINs on it, so devices
  // with no matching DeviceType are excluded rather than returned with nulls.
  const devices = await prisma.device.findMany({
    where: { TypeID: { not: null } },
    include: { DeviceType: true },
  });

  const result = devices
    .filter((d) => d.DeviceType !== null)
    .map((d) => ({
      ID: d.ID,
      TypeID: d.TypeID,
      RackID: d.RackID,
      InternalID: d.InternalID,
      PositionFrom: d.PositionFrom,
      PositionTo: d.PositionTo,
      ElectricityConnected: d.ElectricityConnected,
      TORConnected: d.TORConnected,
      TypeName: d.DeviceType!.TypeName,
      Manufacturer: d.DeviceType!.Manufacturer,
      Usage: d.DeviceType!.Usage,
    }));

  res.json(result);
});

app.get("/vms", async (req: Request, res: Response) => {
  // Same INNER JOIN semantics as /devices, applied to VM -> Service.
  const vms = await prisma.vM.findMany({
    where: { ServiceID: { not: null } },
    include: { Service: true },
  });

  const result = vms
    .filter((v) => v.Service !== null)
    .map((v) => ({
      ID: v.ID,
      DeviceID: v.DeviceID,
      ServiceID: v.ServiceID,
      Name: v.Name,
      ServiceName: v.Service!.Name,
    }));

  res.json(result);
});

app.get("/services", async (req: Request, res: Response) => {
  // Same INNER JOIN semantics, applied to Service -> Customer.
  const services = await prisma.service.findMany({
    where: { CustomerID: { not: null } },
    include: { Customer: true },
  });

  const result = services
    .filter((s) => s.Customer !== null)
    .map((s) => ({
      ID: s.ID,
      Name: s.Name,
      Customer: s.Customer!.Name,
    }));

  res.json(result);
});

app.get("/customers", async (req: Request, res: Response) => {
  const customers = await prisma.customer.findMany();
  res.json(customers);
});

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.users.findMany();
  res.json(users);
});

app.get("/questions", async (req: Request, res: Response) => {
  const questions = await prisma.questions.findMany();
  res.json(questions);
});

app.get("/answers", async (req: Request, res: Response) => {
  const answers = await prisma.answers.findMany();
  res.json(answers);
});

app.get("/", (req, res) => {
  res.json({
    message: "API is working giorA",
  });
});

app.get("/testUrl", (req, res) => {
  res.json({
    message: "Testi Mushavobs da gvixarian",
  });
});

// post operations

app.post("/addRoom", async (req: Request, res: Response) => {
  const { newRoom } = req.body;

  try {
    await prisma.room.create({
      data: {
        Area: toNumber(newRoom.area),
        Capacity: toNumber(newRoom.capacity),
        HeightCm: toNumber(newRoom.heightcm),
      },
    });
    res.json({ message: "new Room added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new Room" });
  }
});

app.post("/addRack", async (req: Request, res: Response) => {
  const { newRack } = req.body;

  try {
    await prisma.rack.create({
      data: {
        RoomID: toNumber(newRack.roomId),
        UnitsSize: toNumber(newRack.unitsSize),
        HeightCm: toNumber(newRack.heightcm),
      },
    });
    res.json({ message: "new Rack added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new Rack" });
  }
});

app.post("/addDeviceType", async (req: Request, res: Response) => {
  const { newDeviceType } = req.body;

  try {
    await prisma.deviceType.create({
      data: {
        TypeName: newDeviceType.typeName,
        Manufacturer: newDeviceType.manufacturer,
        Usage: newDeviceType.usage,
      },
    });
    res.json({ message: "new Device Type added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new Device Type" });
  }
});

app.post("/addDevice", async (req: Request, res: Response) => {
  const { newDevice } = req.body;

  try {
    await prisma.device.create({
      data: {
        TypeID: toNumber(newDevice.typeId),
        RackID: toNumber(newDevice.rackId),
        InternalID: newDevice.internalId,
        PositionFrom: toNumber(newDevice.positionFrom),
        PositionTo: toNumber(newDevice.positionTo),
        ElectricityConnected: toBoolean(newDevice.electricityConnected),
        TORConnected: toBoolean(newDevice.torConnected),
      },
    });
    res.json({ message: "new Device added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new Device" });
  }
});

app.post("/addService", async (req: Request, res: Response) => {
  const { newService } = req.body;

  try {
    await prisma.service.create({
      data: {
        Name: newService.name,
        CustomerID: toNumber(newService.customerId),
      },
    });
    res.json({ message: "new Service added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new Service" });
  }
});

app.post("/addCustomer", async (req: Request, res: Response) => {
  const { newCustomer } = req.body;

  try {
    await prisma.customer.create({
      data: {
        Name: newCustomer.name,
        PhoneNumber: newCustomer.phoneNumber,
      },
    });
    res.json({ message: "new Customer added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new Customer" });
  }
});

app.post("/addVm", async (req: Request, res: Response) => {
  const { newVm } = req.body;

  try {
    await prisma.vM.create({
      data: {
        DeviceID: toNumber(newVm.deviceId),
        ServiceID: toNumber(newVm.serviceId),
        Name: newVm.name,
      },
    });
    res.json({ message: "new VM added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new VM" });
  }
});

// delete operations

app.delete("/deleteRoom/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.room.delete({ where: { ID: Number(id) } });
    res.json({ message: "Room deleted successfully", id });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

app.delete("/deleteRack/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.rack.delete({ where: { ID: Number(id) } });
    res.json({ message: "Rack deleted successfully", id });
  } catch (error) {
    console.error("Delete rack error:", error);
    res.status(500).json({ error: "Failed to delete rack" });
  }
});

app.delete("/deleteDeviceType/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.deviceType.delete({ where: { ID: Number(id) } });
    res.json({ message: "Device Type deleted successfully", id });
  } catch (error) {
    console.error("Delete device type error:", error);
    res.status(500).json({ error: "Failed to delete device type" });
  }
});

app.delete("/deleteDevice/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.device.delete({ where: { ID: Number(id) } });
    res.json({ message: "Device deleted successfully", id });
  } catch (error) {
    console.error("Delete device error:", error);
    res.status(500).json({ error: "Failed to delete device" });
  }
});

app.delete("/deleteService/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.service.delete({ where: { ID: Number(id) } });
    res.json({ message: "Service deleted successfully", id });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

app.delete("/deleteCustomer/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.customer.delete({ where: { ID: Number(id) } });
    res.json({ message: "Customer deleted successfully", id });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

app.delete("/deleteVm/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.vM.delete({ where: { ID: Number(id) } });
    res.json({ message: "VM deleted successfully", id });
  } catch (error) {
    console.error("Delete VM error:", error);
    res.status(500).json({ error: "Failed to delete VM" });
  }
});

// put paths

app.put("/activateQuestions", async (req: Request, res: Response) => {
  const { ids } = req.body;

  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: "No question IDs provided" });
      return;
    }

    await prisma.questions.updateMany({
      where: { ID: { in: ids.map((id: unknown) => Number(id)) } },
      data: { IsActive: true },
    });

    res.json({ message: "Questions activated successfully" });
  } catch (error) {
    console.error("Activate questions error:", error);
    res.status(500).json({ error: "Failed to activate questions" });
  }
});

app.put("/deactivateQuestions", async (req: Request, res: Response) => {
  const { ids } = req.body;

  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: "No question IDs provided" });
      return;
    }

    await prisma.questions.updateMany({
      where: { ID: { in: ids.map((id: unknown) => Number(id)) } },
      data: { IsActive: false },
    });

    res.json({ message: "Questions deactivated successfully" });
  } catch (error) {
    console.error("Deactivate questions error:", error);
    res.status(500).json({ error: "Failed to deactivate questions" });
  }
});

app.put("/updateDevice", async (req: Request, res: Response) => {
  const { updatedDevice } = req.body;

  try {
    if (!updatedDevice || !updatedDevice.id) {
      res.status(400).json({ error: "No device data provided" });
      return;
    }

    await prisma.device.update({
      where: { ID: toNumber(updatedDevice.id) as number },
      data: {
        TypeID: toNumber(updatedDevice.typeId),
        RackID: toNumber(updatedDevice.rackId),
        InternalID: updatedDevice.internalId,
        PositionFrom: toNumber(updatedDevice.positionFrom),
        PositionTo: toNumber(updatedDevice.positionTo),
        ElectricityConnected: toBoolean(updatedDevice.electricityConnected),
        TORConnected: toBoolean(updatedDevice.torConnected),
      },
    });

    res.json({ message: "Device updated successfully" });
  } catch (error) {
    console.error("Update device error:", error);
    res.status(500).json({ error: "Failed to update device" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});