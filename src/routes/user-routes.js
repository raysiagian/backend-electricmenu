import express from "express";
import { protect } from "../middleware/auth-middleware.js";
import { editName } from "../controllers/user-controller.js";
import rateLimit from "express-rate-limit";

const editNameLimiter = rateLimit({
    windowMs : 7 * 24 * 60 * 60 * 1000,
    max: 3,
    message: {
        error: "You can  only change your name once a week"
    }
})

const router = express.Router()

router.patch("/manage-account/edit-name", protect, editNameLimiter, editName)

export default router;