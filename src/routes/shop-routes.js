import express from "express";
import {searchShopbyUserID, createShop, editShop, getShop, deleteShop } from "../controllers/shop-controller.js";
import { protect } from "../middleware/auth-middleware.js";
import rateLimit from "express-rate-limit";

const createShopLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3,
    message: "Too many create shop request, please try again later"
})


const router = express.Router()

// private
router.post("/create-shop", createShopLimiter, protect, createShop)
router.patch("/edit-shops/:id", protect, editShop)
router.delete("/delete-shop/:id", protect, deleteShop)
router.get("/search", protect, searchShopbyUserID)
router.get("/:id", protect, getShop)


export default router;