const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sarbit"
});

db.connect((err) => {
    if (err) {
        console.error("DB connection failed", err);
    } else {
        console.log("Connected to DB");
    }
});

module.exports = db;