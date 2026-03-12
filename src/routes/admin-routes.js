import express from "express";
import { protect } from "../middleware/auth-middleware.js";
import { getAllShopAdmin, getShopByShopIDAdmin, searchShopAdmin, deleteShopAdmin, getShopByUserIDAdmin } from "../controllers/shop-controller.js";

const router = express.Router()

router.get("/shops/search", protect, searchShopAdmin)
router.get("/shops", protect, getAllShopAdmin)
router.get("/shops/user/:user_id", protect, getShopByUserIDAdmin)
router.get("/shops/:id", protect, getShopByShopIDAdmin)
router.delete("/shops/delete-shop/:id", protect, deleteShopAdmin)

export default router;