import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Sarbit Legal API running on Vercel" });
});

// Import user routes
const userRoutes = require("../Backend/routes/userroutes");
app.use("/sarbit", userRoutes);
app.use("/api/sarbit", userRoutes);
app.use("/api", userRoutes);
app.use("/", userRoutes);

export default function handler(req, res) {
  return app(req, res);
}
