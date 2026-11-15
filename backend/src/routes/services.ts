import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { toNumber } from "../helpers/parse";

// VMs, services and customers (Device -> VM -> Service -> Customer)

const router = Router();

router.get("/vms", async (req: Request, res: Response) => {
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

router.get("/services", async (req: Request, res: Response) => {
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

router.get("/customers", async (req: Request, res: Response) => {
  const customers = await prisma.customer.findMany();
  res.json(customers);
});

router.post("/addVm", async (req: Request, res: Response) => {
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

router.post("/addService", async (req: Request, res: Response) => {
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

router.post("/addCustomer", async (req: Request, res: Response) => {
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

router.delete("/deleteVm/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.vM.delete({ where: { ID: Number(id) } });
    res.json({ message: "VM deleted successfully", id });
  } catch (error) {
    console.error("Delete VM error:", error);
    res.status(500).json({ error: "Failed to delete VM" });
  }
});

router.delete("/deleteService/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.service.delete({ where: { ID: Number(id) } });
    res.json({ message: "Service deleted successfully", id });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

router.delete("/deleteCustomer/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.customer.delete({ where: { ID: Number(id) } });
    res.json({ message: "Customer deleted successfully", id });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

export default router;
