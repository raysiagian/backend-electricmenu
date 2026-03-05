import pool from "../config/db.js";

export async function validateOTP({ email, otp }) {
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
        throw new Error("Email is required");
    }

    const result = await pool.query(
        `SELECT otp_code, otp_expired 
        FROM users 
        WHERE email = $1`,
        [normalizedEmail]
    );

    if (result.rows.length === 0) {
        throw new Error("User not found");
    }

    const user = result.rows[0];

    if (!user.otp_code) {
        throw new Error("OTP not found");
    }

    if (Number(user.otp_code) !== Number(otp)) {
        throw new Error("Invalid OTP");
    }

    if (new Date() > new Date(user.otp_expired)) {
        throw new Error("OTP expired");
    }

    console.log("DB OTP:", user.otp_code);
    console.log("REQUEST OTP:", otp);

    return true;
}
