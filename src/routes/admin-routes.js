import express from "express";
import { protect } from "../middleware/auth-middleware.js";
import { getAllShopAdmin, getShopByShopIDAdmin, searchShopAdmin, deleteShopAdmin, getShopByUserIDAdmin } from "../controllers/shop-controller.js";
import { activatedUserAccountAdmin, deactivatedUserAccountAdmin } from "../controllers/user-controller.js";

const router = express.Router()

// user


// shop
router.get("/shops/search", protect, searchShopAdmin)
router.get("/shops", protect, getAllShopAdmin)
router.get("/shops/user/:user_id", protect, getShopByUserIDAdmin)
router.get("/shops/:id", protect, getShopByShopIDAdmin)
router.delete("/shops/delete-shop/:id", protect, deleteShopAdmin)

// user
router.patch("/users/:id/deactivate", protect, deactivatedUserAccountAdmin)
router.patch("/users/:id/activate", protect, activatedUserAccountAdmin)

export default router;