import express from "express";
import { protect } from "../middleware/auth-middleware.js";
import { getAllShopAdmin, getShopByShopIDAdmin, searchShopAdmin } from "../controllers/shop-controller.js";

const router = express.Router()

router.get("/shops/search", protect, searchShopAdmin) // belum di test
router.get("/shops", protect, getAllShopAdmin) // belum di test
router.get("/shops/:id", protect, getShopByShopIDAdmin) // belum di test

export default router;