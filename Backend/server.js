const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images and pdfs with absolute paths
const imagesDir = path.join(__dirname, "images");
const pdfsDir = path.join(__dirname, "pdfs");

app.use("/images", express.static(imagesDir));
app.use("/backend/images", express.static(imagesDir));
app.use("/pdfs", express.static(pdfsDir));
app.use("/backend/pdfs", express.static(pdfsDir));

app.use("/sarbit", require("./routes/userroutes"));

app.listen(5000, () => {
    console.log("Server running on port 5000");
});


