import express from "express";
import { getShopPublic } from "../controllers/shop-controller.js";

const router = express.Router()


// public
router.get("/:shop_slug", getShopPublic)

export default router;