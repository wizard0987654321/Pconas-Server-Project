import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db";
import { login, logout, me, requireAuth } from "./auth";

// Routes, grouped by topic (URLs are defined inside each file)
import roomsRouter from "./routes/rooms";
import equipmentRouter from "./routes/equipment";
import connectionsRouter from "./routes/connections";
import devicesRouter from "./routes/devices";
import servicesRouter from "./routes/services";
import quizRouter from "./routes/quiz";
import faultsRouter from "./routes/faults";
import networkRouter from "./routes/network";

dotenv.config();

const app = express();

// Cookies are only sent cross-origin (5173 -> 5000) when CORS names the exact
// frontend origin and allows credentials, "*" is not allowed together with cookies
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// public routes (no login needed)

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

app.post("/login", login);
app.post("/logout", logout);

// Everything registered BELOW this line requires a valid login cookie.
// Express runs middleware in the order it is registered, so the position matters.
app.use(requireAuth);

app.get("/me", me);

// GET /users was removed: it sent every user including passwords to the browser.
// Login is checked on the server now (POST /login in auth.ts).

app.use(roomsRouter);
app.use(equipmentRouter);
app.use(connectionsRouter);
app.use(devicesRouter);
app.use(servicesRouter);
app.use(quizRouter);
app.use(faultsRouter);
app.use(networkRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});
