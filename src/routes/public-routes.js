import express from "express";
import rateLimit from "express-rate-limit";
import { getShopPublic } from "../controllers/shop-controller.js";
import {getAllProductsByShopSlug} from "../controllers/product-controller.js"
import { createOrder } from "../controllers/order-controller.js";


const orderLimiter = rateLimit({
    windowMs: 60 * 1000,  // 1 menit
    max: 5,               // max 5 order per menit per IP
    message: { error: "Too many orders. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

const router = express.Router()

// public
router.get("/shop/:shop_slug", getShopPublic)
router.get("/shop/:shop_slug/products", getAllProductsByShopSlug)
router.post("/shop/:shop_slug/order/create-order", orderLimiter, createOrder)

export default router;