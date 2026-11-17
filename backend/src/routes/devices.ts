import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { toNumber, toBoolean } from "../helpers/parse";

// Device types and devices (servers etc. mounted in racks)

const router = Router();

// Checks the "plugged into in-rack UPS" choice of a device, returns an error text or null.
// Allowed: a UPS device (type IsUps) in the same rack, which itself hangs on the rack feed.
// A UPS device can't be plugged into another UPS (no chains).
async function checkPoweredBy(deviceId: number | null, rackId: number | null | undefined, typeId: number | null | undefined, poweredById: number | null | undefined) {
  if (poweredById == null) return null;

  const ownType = typeId != null ? await prisma.deviceType.findUnique({ where: { ID: typeId } }) : null;
  if (ownType?.IsUps) return "A UPS can't be plugged into another UPS";

  const ups = await prisma.device.findUnique({ where: { ID: poweredById }, include: { DeviceType: true } });
  if (!ups || !ups.DeviceType?.IsUps) return "The chosen power source is not a UPS";
  if (ups.ID === deviceId) return "A device can't be plugged into itself";
  if (ups.RackID !== rackId) return "The UPS must be in the same rack";

  return null;
}

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
      PoweredByDeviceID: d.PoweredByDeviceID,
      TypeName: d.DeviceType!.TypeName,
      Manufacturer: d.DeviceType!.Manufacturer,
      Usage: d.DeviceType!.Usage,
      IsUps: d.DeviceType!.IsUps,
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
        IsUps: toBoolean(newDeviceType.isUps) ?? false,
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
    const typeId = toNumber(newDevice.typeId);
    const rackId = toNumber(newDevice.rackId);
    const poweredById = toNumber(newDevice.poweredByDeviceId);

    const poweredByError = await checkPoweredBy(null, rackId, typeId, poweredById);
    if (poweredByError) {
      res.status(400).json({ error: poweredByError });
      return;
    }

    await prisma.device.create({
      data: {
        TypeID: typeId,
        RackID: rackId,
        InternalID: newDevice.internalId,
        PositionFrom: toNumber(newDevice.positionFrom),
        PositionTo: toNumber(newDevice.positionTo),
        ElectricityConnected: toBoolean(newDevice.electricityConnected),
        TORConnected: toBoolean(newDevice.torConnected),
        PoweredByDeviceID: poweredById ?? null,
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

    const deviceId = toNumber(updatedDevice.id) as number;
    const typeId = toNumber(updatedDevice.typeId);
    const rackId = toNumber(updatedDevice.rackId);
    const poweredById = toNumber(updatedDevice.poweredByDeviceId);

    const poweredByError = await checkPoweredBy(deviceId, rackId, typeId, poweredById);
    if (poweredByError) {
      res.status(400).json({ error: poweredByError });
      return;
    }

    const newType = typeId != null ? await prisma.deviceType.findUnique({ where: { ID: typeId } }) : null;

    await prisma.$transaction([
      // Devices plugged into this one lose that connection if it is no longer a UPS
      // or moved to another rack (they stay in their rack, now on the rack feed)
      prisma.device.updateMany({
        where: {
          PoweredByDeviceID: deviceId,
          ...(newType?.IsUps ? { RackID: { not: rackId } } : {}),
        },
        data: { PoweredByDeviceID: null },
      }),
      prisma.device.update({
        where: { ID: deviceId },
        data: {
          TypeID: typeId,
          RackID: rackId,
          InternalID: updatedDevice.internalId,
          PositionFrom: toNumber(updatedDevice.positionFrom),
          PositionTo: toNumber(updatedDevice.positionTo),
          ElectricityConnected: toBoolean(updatedDevice.electricityConnected),
          TORConnected: toBoolean(updatedDevice.torConnected),
          PoweredByDeviceID: poweredById ?? null,
        },
      }),
    ]);

    res.json({ message: "Device updated successfully" });
  } catch (error) {
    console.error("Update device error:", error);
    res.status(500).json({ error: "Failed to update device" });
  }
});

router.delete("/deleteDeviceType/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Devices of this type are deleted by the cascade. Unplug other devices from them first
    // (PoweredByDeviceID is NO ACTION)
    await prisma.$transaction([
      prisma.device.updateMany({
        where: { PoweredBy: { TypeID: Number(id) } },
        data: { PoweredByDeviceID: null },
      }),
      prisma.deviceType.delete({ where: { ID: Number(id) } }),
    ]);
    res.json({ message: "Device Type deleted successfully", id });
  } catch (error) {
    console.error("Delete device type error:", error);
    res.status(500).json({ error: "Failed to delete device type" });
  }
});

router.delete("/deleteDevice/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Devices plugged into this one (if it is a UPS) go back to the rack feed first
    await prisma.$transaction([
      prisma.device.updateMany({
        where: { PoweredByDeviceID: Number(id) },
        data: { PoweredByDeviceID: null },
      }),
      prisma.device.delete({ where: { ID: Number(id) } }),
    ]);
    res.json({ message: "Device deleted successfully", id });
  } catch (error) {
    console.error("Delete device error:", error);
    res.status(500).json({ error: "Failed to delete device" });
  }
});

export default router;
