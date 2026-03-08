import express from "express";
import {searchShopbyUserID, createShop, editShop, getShop, getShopPublic, deleteShop } from "../controllers/shop-controller.js";
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
router.delete("/delete-shop/:id". protect, deleteShop) // belum di test
router.get("/search", protect, searchShopbyUserID) // belum di test
router.get("/:id", protect, getShop)


// public
router.get("/public/:shop_slug", getShopPublic)

export default router;