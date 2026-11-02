const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

// Enable CORS for all incoming requests and static files
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images and pdfs with absolute paths
const imagesDir = path.join(__dirname, "images");
const pdfsDir = path.join(__dirname, "pdfs");

app.use("/images", express.static(imagesDir));
app.use("/backend/images", express.static(imagesDir));
app.use("/pdfs", express.static(pdfsDir));
app.use("/backend/pdfs", express.static(pdfsDir));

// Health-check endpoint for Render / test
app.get("/", (req, res) => {
    res.send("Sarbit Legal Backend is running successfully!");
});

app.use("/sarbit", require("./routes/userroutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
