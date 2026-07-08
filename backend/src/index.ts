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