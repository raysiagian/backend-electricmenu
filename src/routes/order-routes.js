import express from "express";
import { protect } from "../middleware/auth-middleware.js";
import { getOrdersByShop, updateOrderStatus, getUserPendingOrders } from "../controllers/order-controller.js";

const router = express.Router();


router.get("/shop/:shop_id/get-shop-order", protect, getOrdersByShop)
router.get("/pending-orders", protect, getUserPendingOrders)
router.patch("/:order_id/status", protect, updateOrderStatus)

export default router;