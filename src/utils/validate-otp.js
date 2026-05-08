import pool from "../config/db.js";
import bcrypt from 'bcryptjs'

export async function validateOTP({ email, otp }) {

    if (!email || !email.trim()) {
        throw new Error("Email is required");
    }

    if (!otp) {
        throw new Error("OTP is required");
    }

    if (!/^\d{4}$/.test(String(otp).trim())) {
        throw new Error("OTP must be 4 digits");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
        `SELECT otp_code, otp_expired FROM users WHERE email = $1`,
        [normalizedEmail]
    );

    if (result.rows.length === 0) throw new Error("User not found");

    const { otp_code, otp_expired } = result.rows[0];

    if (!otp_code) throw new Error("OTP not found");

    // cek expired sebelum bcrypt (expired lebih murah)
    if (new Date() > new Date(otp_expired)) throw new Error("OTP expired");

    // bandingkan input dengan hash di DB
    const isValid = await bcrypt.compare(String(otp).trim(), otp_code);
    if (!isValid) throw new Error("Invalid OTP");

    return true;
}