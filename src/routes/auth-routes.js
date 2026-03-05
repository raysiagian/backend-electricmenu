import express from "express"
import { changePassword, login, registerAdmin, registerUser, resendRegisterOTP, sendResetPasswordOTP, verifyOTP } from "../controllers/auth-controller.js"
import rateLimit from "express-rate-limit";

const otpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 menit
    max: 3, // max 3 request per menit per IP
    message: "Too many OTP requests. Please try again later."
});

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 5, // max 5 register per IP dalam 15 menit
    message: "Too many registration attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});


const router = express.Router()

router.post("/register-admin",registerLimiter, registerAdmin)
router.post("/register-user",registerLimiter, registerUser)
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp",otpLimiter, resendRegisterOTP);

router.post("/reset-password-otp", otpLimiter, sendResetPasswordOTP);
router.patch("/reset-password", changePassword)

router.post("/login", login)

export default router