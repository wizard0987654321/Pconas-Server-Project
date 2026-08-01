import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, sql } from "./db";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//backend communication with database

app.get("/rooms", async (req, res) => {
  const result = await sql.query(`
    SELECT 
      ID,
      ROW_NUMBER() OVER (ORDER BY ID) AS RoomNumber,
      Area,
      Capacity,
      HeightCm
    FROM Room
  `);

  res.json(result.recordset);
});

app.get("/racks", async (req, res) => {
  const result = await sql.query(`SELECT 
    r.ID,
    r.RoomID,
    r.UnitsSize,
    r.HeightCm,
    RoomNumbers.RoomNumber
FROM Rack r
JOIN (
    SELECT 
        ID,
        ROW_NUMBER() OVER (ORDER BY ID) AS RoomNumber
    FROM Room
) RoomNumbers
ON r.RoomID = RoomNumbers.ID;`);
  res.json(result.recordset);
});

app.get("/deviceTypes", async (req, res) => {
  const result = await sql.query("SELECT * FROM DeviceType");
  res.json(result.recordset);
});

app.get("/devices", async (req, res) => {
  const result = await sql.query(`
    SELECT
      d.ID,
      d.TypeID,
      d.RackID,
      d.InternalID,
      d.PositionFrom,
      d.PositionTo,
      d.ElectricityConnected,
      d.TORConnected,
      dt.TypeName,
      dt.Manufacturer,
      dt.Usage,
      dt.ID 
    FROM Device d
    JOIN DeviceType dt ON d.TypeID = dt.ID
  `);
  res.json(result.recordset);
});

app.get("/vms", async (req, res) => {
  const result = await sql.query("SELECT v.ID, v.DeviceID, v.ServiceID, v.Name, s.Name AS ServiceName FROM VM v JOIN Service s ON v.ServiceID=s.ID");
  res.json(result.recordset);
});

app.get("/services", async (req, res) => {
  const result = await sql.query("SELECT s.ID, s.Name, c.Name AS Customer FROM Service s JOIN Customer c ON s.CustomerID=c.ID");
  res.json(result.recordset);
});

app.get("/customers", async (req, res) => {
  const result = await sql.query("SELECT * FROM Customer");
  res.json(result.recordset);
});

app.get("/users", async (req, res) => {
  const result = await sql.query("SELECT * FROM Users");
  res.json(result.recordset);
});

app.get("/questions", async (req, res) => {
  const result = await sql.query("SELECT * FROM Questions");
  res.json(result.recordset);
});

app.get("/answers", async (req, res) => {
  const result = await sql.query("SELECT * FROM Answers");
  res.json(result.recordset);
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

app.post('/addRoom', async (req, res) => {
  const { newRoom } = req.body

  try {
    await sql.query(`INSERT INTO Room (Area, Capacity, HeightCm) VALUES (${newRoom.area}, ${newRoom.capacity}, ${newRoom.heightcm})`)
    res.json({ message: 'new Room added' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add new Room' })
  }
})

app.post('/addRack', async (req, res) => {
  const { newRack } = req.body

  try {
    await sql.query(`INSERT INTO Rack (RoomID, UnitsSize, HeightCm) VALUES (${newRack.roomId}, ${newRack.unitsSize}, ${newRack.heightcm})`)
    res.json({ message: 'new Rack added' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add new Rack' })
  }
})

app.post('/addDeviceType', async (req, res) => {
  const { newDeviceType } = req.body

  try {
    const request = new sql.Request();

    await request
      .input('typeName', sql.NVarChar, newDeviceType.typeName)
      .input('manufacturer', sql.NVarChar, newDeviceType.manufacturer)
      .input('usage', sql.NVarChar, newDeviceType.usage)
      .query(`INSERT INTO DeviceType (TypeName, Manufacturer, Usage) VALUES (@typeName, @manufacturer, @usage)`)

    res.json({ message: 'new Device Type added' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add new Device Type' })
  }
})

app.post('/addDevice', async (req, res) => {
  const { newDevice } = req.body

  try {
    await sql.query`
    INSERT INTO Device (
        TypeID,
        RackID,
        InternalID,
        PositionFrom,
        PositionTo,
        ElectricityConnected,
        TORConnected
    )
    VALUES (
        ${newDevice.typeId},
        ${newDevice.rackId},
        ${newDevice.internalId},
        ${newDevice.positionFrom},
        ${newDevice.positionTo},
        ${newDevice.electricityConnected},
        ${newDevice.torConnected}
    )`; 
    res.json({ message: 'new Device added' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add new Device' })
  }
})

app.post('/addService', async (req, res) => {
  const { newService } = req.body

  try {
    const request = new sql.Request();

    await request
      .input('name', sql.NVarChar, newService.name)
      .input('customerId', sql.Int, newService.customerId)
      .query(`INSERT INTO Service (Name, CustomerID) VALUES (@name, @customerId)`)

    res.json({ message: 'new Service added' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add new Service' })
  }
})

app.post('/addCustomer', async (req, res) => {
  const { newCustomer } = req.body

  try {
    const request = new sql.Request();

    await request
      .input('name', sql.NVarChar, newCustomer.name)
      .input('phoneNumber', sql.NVarChar, newCustomer.phoneNumber)
      .query(`INSERT INTO Customer (Name, PhoneNumber) VALUES (@name, @phoneNumber)`)

    res.json({ message: 'new Customer added' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add new Customer' })
  }
})

app.post('/addVm', async (req, res) => {
  const { newVm } = req.body

  try {
    const request = new sql.Request();

    await request
      .input('deviceId', sql.Int, newVm.deviceId)
      .input('serviceId', sql.Int, newVm.serviceId)
      .input('name', sql.NVarChar, newVm.name)
      .query(`INSERT INTO VM (DeviceID, ServiceID, Name) VALUES (@deviceId, @serviceId, @name)`)

    res.json({ message: 'new VM added' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add new VM' })
  }
})

// delete operations

app.delete("/deleteRoom/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql.query(`
      DELETE FROM Room
      WHERE ID = ${id}
    `);

    res.json({ message: "Room deleted successfully", id });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

app.delete("/deleteRack/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql.query(`
      DELETE FROM Rack
      WHERE ID = ${id}
    `);

    res.json({ message: "Rack deleted successfully", id });
  } catch (error) {
    console.error("Delete rack error:", error);
    res.status(500).json({ error: "Failed to delete rack" });
  }
});

app.delete("/deleteDeviceType/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql.query(`
      DELETE FROM DeviceType
      WHERE ID = ${id}
    `);

    res.json({ message: "Device Type deleted successfully", id });
  } catch (error) {
    console.error("Delete device type error:", error);
    res.status(500).json({ error: "Failed to delete device type" });
  }
});

app.delete("/deleteDevice/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql.query(`
      DELETE FROM Device
      WHERE ID = ${id}
    `);

    res.json({ message: "Device deleted successfully", id });
  } catch (error) {
    console.error("Delete device error:", error);
    res.status(500).json({ error: "Failed to delete device" });
  }
});

app.delete("/deleteService/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await sql.query(`
      DELETE FROM Service
      WHERE ID = ${id}
    `);

    res.json({ message: "Service deleted successfully", id });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

app.delete("/deleteCustomer/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await sql.query(`
      DELETE FROM Customer
      WHERE ID = ${id}
    `);

    res.json({ message: "Customer deleted successfully", id });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

app.delete("/deleteVm/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await sql.query(`
      DELETE FROM VM
      WHERE ID = ${id}
    `);

    res.json({ message: "VM deleted successfully", id });
  } catch (error) {
    console.error("Delete VM error:", error);
    res.status(500).json({ error: "Failed to delete VM" });
  }
});


//put paths
app.put('/activateQuestions', async (req, res) => {
  const { ids } = req.body;

  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No question IDs provided" });
    }

    const placeholders = ids.map((_, index) => `@id${index}`).join(",");

    const request = new sql.Request();

    ids.forEach((id, index) => {
      request.input(`id${index}`, sql.Int, id);
    });

    await request.query(`
      UPDATE Questions
      SET IsActive = 1
      WHERE ID IN (${placeholders})
    `);

    res.json({ message: "Questions activated successfully" });

  } catch (error) {
    console.error("Activate questions error:", error);
    res.status(500).json({ error: "Failed to activate questions" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});

app.put('/deactivateQuestions', async (req, res) => {
  const { ids } = req.body;

  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No question IDs provided" });
    }

    const placeholders = ids.map((_, index) => `@id${index}`).join(",");

    const request = new sql.Request();

    ids.forEach((id, index) => {
      request.input(`id${index}`, sql.Int, id);
    });

    await request.query(`
      UPDATE Questions
      SET IsActive = 0
      WHERE ID IN (${placeholders})
    `);

    res.json({ message: "Questions deactivated successfully" });

  } catch (error) {
    console.error("Deactivate questions error:", error);
    res.status(500).json({ error: "Failed to deactivate questions" });
  }
});