import express from "express";
import { protect } from "../middleware/auth-middleware.js";
import { getOrdersByShop, updateOrderStatus, getUserPendingOrders, createWalkInOrder } from "../controllers/order-controller.js";
import rateLimit from "express-rate-limit";

const createWalkOrderLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: "Too many create shop request, please try again later"
})

const router = express.Router();

router.post("/shop/:shop_id/create-walk-order", createWalkOrderLimiter, protect, createWalkInOrder)
router.get("/shop/:shop_id/get-shop-order", protect, getOrdersByShop)
router.get("/pending-orders", protect, getUserPendingOrders)
router.patch("/:order_id/status", protect, updateOrderStatus)

export default router;