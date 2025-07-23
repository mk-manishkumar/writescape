import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDb } from "./configs/db.js";

const app = express();

await connectDb();

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Writescape API");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;