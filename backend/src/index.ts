import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import { prisma } from "./prisma";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//backend communication with database

app.get("/rooms", async (req, res) => {
  const rooms = await prisma.room.findMany();

  res.json(rooms);
});

app.get("/racks", async (req, res) => {
  // Original SQL used ROW_NUMBER() OVER (ORDER BY ID) on Room to build a
  // sequential RoomNumber, then joined it onto Rack. Prisma has no window
  // function support, so we build the same numbering in JS.
  const rooms = await prisma.room.findMany({
    orderBy: { ID: "asc" },
    select: { ID: true },
  });
  const roomNumberByRoomId = new Map(rooms.map((room, index) => [room.ID, index + 1]));

  const racks = await prisma.rack.findMany({
    orderBy: { ID: "asc" },
    select: {
      ID: true,
      RoomID: true,
      UnitsSize: true,
      HeightCm: true,
    },
  });

  const result = racks
    .filter((rack) => rack.RoomID !== null && roomNumberByRoomId.has(rack.RoomID))
    .map((rack) => ({
      ID: rack.ID,
      RoomID: rack.RoomID,
      UnitsSize: rack.UnitsSize,
      HeightCm: rack.HeightCm,
      RoomNumber: roomNumberByRoomId.get(rack.RoomID as number),
    }));

  res.json(result);
});

app.get("/deviceTypes", async (req, res) => {
  const deviceTypes = await prisma.deviceType.findMany();

  res.json(deviceTypes);
});

app.get("/devices", async (req, res) => {
  const devices = await prisma.device.findMany({
    where: { TypeID: { not: null } }, // matches the original INNER JOIN
    include: { DeviceType: true },
  });

  const result = devices
    .filter((d) => d.DeviceType !== null)
    .map((d) => ({
      // NOTE: the original query selected both d.ID and dt.ID, and the second
      // one silently overwrote the first in the result object. Replicating
      // that here so the output matches exactly - this is DeviceType.ID, not
      // Device.ID. Swap to `d.ID` below if you actually want the device's own id.
      ID: d.DeviceType!.ID,
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

app.get("/vms", async (req, res) => {
  const vms = await prisma.vM.findMany({
    where: { ServiceID: { not: null } }, // matches the original INNER JOIN
    include: { Service: true },
  });

  const result = vms
    .filter((vm) => vm.Service !== null)
    .map((vm) => ({
      ID: vm.ID,
      DeviceID: vm.DeviceID,
      ServiceID: vm.ServiceID,
      Name: vm.Name,
      ServiceName: vm.Service!.Name,
    }));

  res.json(result);
});

app.get("/services", async (req, res) => {
  const services = await prisma.service.findMany({
    where: { CustomerID: { not: null } }, // matches the original INNER JOIN
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

app.get("/customers", async (req, res) => {
  const customers = await prisma.customer.findMany();

  res.json(customers);
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

app.post("/addRoom", async (req, res) => {
  const { newRoom } = req.body;

  try {
    await prisma.room.create({
      data: {
        Area: newRoom.area,
        Capacity: newRoom.capacity,
        HeightCm: newRoom.heightcm,
      },
    });
    res.json({ message: "new Room added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new Room" });
  }
});

app.post("/addRack", async (req, res) => {
  const { newRack } = req.body;

  try {
    await prisma.rack.create({
      data: {
        RoomID: newRack.roomId,
        UnitsSize: newRack.unitsSize,
        HeightCm: newRack.heightcm,
      },
    });
    res.json({ message: "new Rack added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new Rack" });
  }
});

app.post("/addDeviceType", async (req, res) => {
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

app.post("/addDevice", async (req, res) => {
  const { newDevice } = req.body;

  try {
    await prisma.device.create({
      data: {
        TypeID: newDevice.typeId,
        RackID: newDevice.rackId,
        InternalID: newDevice.internalId,
        PositionFrom: newDevice.positionFrom,
        PositionTo: newDevice.positionTo,
        ElectricityConnected: newDevice.electricityConnected,
        TORConnected: newDevice.torConnected,
      },
    });
    res.json({ message: "new Device added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new Device" });
  }
});

app.post("/addService", async (req, res) => {
  const { newService } = req.body;

  try {
    await prisma.service.create({
      data: {
        Name: newService.name,
        CustomerID: newService.customerId,
      },
    });

    res.json({ message: "new Service added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new Service" });
  }
});

app.post("/addCustomer", async (req, res) => {
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

app.post("/addVm", async (req, res) => {
  const { newVm } = req.body;

  try {
    await prisma.vM.create({
      data: {
        DeviceID: newVm.deviceId,
        ServiceID: newVm.serviceId,
        Name: newVm.name,
      },
    });

    res.json({ message: "new VM added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add new VM" });
  }
});

// delete operations

app.delete("/deleteRoom/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.room.delete({ where: { ID: Number(id) } });
    res.json({ message: "Room deleted successfully", id });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

app.delete("/deleteRack/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.rack.delete({ where: { ID: Number(id) } });
    res.json({ message: "Rack deleted successfully", id });
  } catch (error) {
    console.error("Delete rack error:", error);
    res.status(500).json({ error: "Failed to delete rack" });
  }
});

app.delete("/deleteDeviceType/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.deviceType.delete({ where: { ID: Number(id) } });
    res.json({ message: "Device Type deleted successfully", id });
  } catch (error) {
    console.error("Delete device type error:", error);
    res.status(500).json({ error: "Failed to delete device type" });
  }
});

app.delete("/deleteDevice/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.device.delete({ where: { ID: Number(id) } });
    res.json({ message: "Device deleted successfully", id });
  } catch (error) {
    console.error("Delete device error:", error);
    res.status(500).json({ error: "Failed to delete device" });
  }
});

app.delete("/deleteService/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.service.delete({ where: { ID: Number(id) } });
    res.json({ message: "Service deleted successfully", id });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

app.delete("/deleteCustomer/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.customer.delete({ where: { ID: Number(id) } });
    res.json({ message: "Customer deleted successfully", id });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

app.delete("/deleteVm/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.vM.delete({ where: { ID: Number(id) } });
    res.json({ message: "VM deleted successfully", id });
  } catch (error) {
    console.error("Delete VM error:", error);
    res.status(500).json({ error: "Failed to delete VM" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});