import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { toNumber, toBoolean } from "../helpers/parse";

// Device types and devices (servers etc. mounted in racks)

const router = Router();

router.get("/deviceTypes", async (req: Request, res: Response) => {
  const deviceTypes = await prisma.deviceType.findMany();
  res.json(deviceTypes);
});

router.get("/devices", async (req: Request, res: Response) => {
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

router.post("/addDeviceType", async (req: Request, res: Response) => {
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

router.post("/addDevice", async (req: Request, res: Response) => {
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

router.put("/updateDevice", async (req: Request, res: Response) => {
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

router.delete("/deleteDeviceType/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.deviceType.delete({ where: { ID: Number(id) } });
    res.json({ message: "Device Type deleted successfully", id });
  } catch (error) {
    console.error("Delete device type error:", error);
    res.status(500).json({ error: "Failed to delete device type" });
  }
});

router.delete("/deleteDevice/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.device.delete({ where: { ID: Number(id) } });
    res.json({ message: "Device deleted successfully", id });
  } catch (error) {
    console.error("Delete device error:", error);
    res.status(500).json({ error: "Failed to delete device" });
  }
});

export default router;
