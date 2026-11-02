const mysql = require("mysql2");

let isConnected = false;

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "sarbit",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    connectTimeout: 5000
});

db.connect((err) => {
    if (err) {
        console.error("DB connection failed (will use fallback data):", err.message);
        isConnected = false;
    } else {
        console.log("Connected to DB successfully");
        isConnected = true;
    }
});

db.on("error", (err) => {
    console.error("MySQL connection error:", err.message);
    isConnected = false;
});

module.exports = db;
