import dotenv from "dotenv";
dotenv.config();

import express from "express";
import pool from "./src/config/db.js"

// routes
import authRoutes from "./src/routes/auth-routes.js"

const app = express();
const port = 3000;
const baseURL = `http://localhost:${port}`

app.use(express.json())

// check connectivity
pool.connect()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch(err => {
        console.error("Database connection error", err);
});

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
        console.log(process.env.DB_NAME);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

// api routes
app.use("/api/auth/", authRoutes);

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

