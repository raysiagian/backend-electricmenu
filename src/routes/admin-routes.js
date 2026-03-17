import express from "express";
import { protect } from "../middleware/auth-middleware.js";
import { getAllShopAdmin, getShopByShopIDAdmin, searchShopAdmin, deleteShopAdmin, getShopByUserIDAdmin } from "../controllers/shop-controller.js";
import { activatedUserAccountAdmin, deactivatedUserAccountAdmin } from "../controllers/user-controller.js";
import { createType, editType, deleteType, getTypeByID, searchType } from "../controllers/type-controller.js";

const router = express.Router()

// manage shop
router.get("/shops/search", protect, searchShopAdmin)
router.get("/shops", protect, getAllShopAdmin)
router.get("/shops/user/:user_id", protect, getShopByUserIDAdmin)
router.get("/shops/:id", protect, getShopByShopIDAdmin)
router.delete("/shops/delete-shop/:id", protect, deleteShopAdmin)

// manage user
router.patch("/users/:id/deactivate", protect, deactivatedUserAccountAdmin)
router.patch("/users/:id/activate", protect, activatedUserAccountAdmin)


// manage type
router.get("/types/search", protect, searchType)
router.get("/types/:id", protect, getTypeByID)
router.post("/types/create-type", protect, createType)
router.patch("/types/edit-type/:id", protect, editType)
router.delete("/types/delete-type/:id", protect, deleteType)


export default router;