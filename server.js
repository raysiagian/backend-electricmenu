import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import pool from "./src/config/db.js"


// routes
import authRoutes from "./src/routes/auth-routes.js"
import shopRoutes from "./src/routes/shop-routes.js"
import productRoutes from "./src/routes/product-routes.js"
import orderRoutes from "./src/routes/order-routes.js"
import adminRoutes from "./src/routes/admin-routes.js"
import publicRoutes from "./src/routes/public-routes.js"
import userRoutes from "./src/routes/user-routes.js"
import typeRoutes from "./src/routes/type-routes.js"

const app = express();
const port = 3000;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json())
app.use("/qr", express.static("uploads/qr_image"));
app.use("/product", express.static("uploads/product_image"))
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
app.use("/api/shop/", shopRoutes);
app.use("/api/product", productRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/admin/", adminRoutes);
app.use("/api/public/", publicRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/type/", typeRoutes)

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS);


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

