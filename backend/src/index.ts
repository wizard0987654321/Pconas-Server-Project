import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, sql } from "./db";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


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
  const result = await sql.query("SELECT * FROM Device d JOIN DeviceType dt ON d.TypeID=dt.ID");
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});