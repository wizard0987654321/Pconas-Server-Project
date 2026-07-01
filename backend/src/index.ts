import express  from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json())

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

app.listen(PORT, () => {
    console.log(`Server runnning on PORT ${PORT}`)
})