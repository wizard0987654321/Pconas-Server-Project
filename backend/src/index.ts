import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, sql } from "./db";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/rooms", async (req, res) => {
  const result = await sql.query("SELECT * FROM Room");
  res.json(result.recordset);
});

app.get("/racks", async (req, res) => {
    const result = await sql.query("SELECT * FROM Rack");
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


const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});