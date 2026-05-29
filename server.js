import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import pool from "./src/config/db.js"
import supabase from "./src/config/supabase.js"

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
// app.use(cors({
//     // origin: "http://localhost:5173",
//     // origin: "https://frontend-electricmenu.vercel.app",
//     origin: true,
//     credentials: true
// }));

const allowedOrigins = [
  "https://frontend-electricmenu.vercel.app", // Domain produksi kamu
  "http://localhost:5173"                    // Biar kamu tetep bisa ngoding lokal di laptop
];

app.use(cors({
  origin: function (origin, callback) {
    // Izinkan request tanpa origin (seperti Postman, mobile apps, atau server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
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

