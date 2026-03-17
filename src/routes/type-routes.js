import express from "express";
import { protect } from "../middleware/auth-middleware.js";
import { searchTypeDropdownUser } from "../controllers/type-controller.js";

const router = express.Router()

// private

router.get("/search-type", protect, searchTypeDropdownUser)

export default router