import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express();

await connectDb();

// Middlewares
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => res.send("Welcome to the Writescape API"));
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/blog", blogRouter);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}


export default app;
