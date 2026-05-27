import express from "express"
import { protect } from "../middleware/auth-middleware.js";
import { 
    resetPassword, 
    login, 
    logout, 
    registerAdmin, 
    registerUser, 
    resendRegisterOTP, 
    sendResetPasswordOTP,
    resendResetPasswordOTP, 
    verifyOTP,
    refreshToken,
    verifyOTPChangePassword,
    changePassword
} from "../controllers/auth-controller.js"
import rateLimit from "express-rate-limit";

const otpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 menit
    max: 3, // max 1 request per menit per IP
    message: "Too many OTP requests. Please try again later."
});

// const resetPasswordOTPLimiter ({
//     windowMs: 60 * 1000, // 1 menit
//     max: 3, // max 3 request per menit per IP
//     message: "Too many OTP requests. Please try again later."
// })

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 5, // max 5 register per IP dalam 15 menit
    message: "Too many registration attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 menit
    max: 3,
    message: "Too many login request. Please try later"
});

const verifyOtpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 menit
    max: 3, // max 3 percobaan
    message: "Too many OTP attempts. Please try again later."
});

const resetPasswordLimiter = rateLimit ({
    windowMs: 5 * 60 * 1000, // 5 menit
    max: 3,
    message: "Too many reset password request. Please try later"
})

const changePasswordLimiter = rateLimit ({
    windowMs: 5 * 60 * 1000, // 5 menit
    max: 3,
    message: "Too many change password request. Please try later"
})

// const verifyResetPasswordOTPLimiter = rateLimit({
//     windowMs: 60 * 1000, // 1 menit
//     max: 3, // max 3 percobaan
//     message: "Too many OTP attempts. Please try again later.
// })


const router = express.Router()


router.post("/register-admin",registerLimiter, registerAdmin)
router.post("/register-user",registerLimiter, registerUser)
router.post("/verify-otp", verifyOtpLimiter, verifyOTP);
router.post("/resend-otp",otpLimiter, resendRegisterOTP);
router.post("/refresh-token", refreshToken);

router.post("/reset-password-otp", otpLimiter, sendResetPasswordOTP);
router.post("/resend-reset-password-otp",otpLimiter, resendResetPasswordOTP)
router.patch("/reset-password",resetPasswordLimiter, resetPassword)

router.post("/change-password/send-otp",otpLimiter,protect, sendResetPasswordOTP);
router.post("/change-password/verify-otp",otpLimiter,protect, verifyOTPChangePassword);
router.post("/change-password/confirm",changePasswordLimiter,protect, changePassword);

router.post("/login", loginLimiter, login)
router.post("/logout",protect, logout)

export default router