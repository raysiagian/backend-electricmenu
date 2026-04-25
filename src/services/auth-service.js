import bcrypt from 'bcryptjs'
import pool from '../config/db.js'
import { sendForgotPasswordOTPEmail } from '../utils/send-forgot-password-otp-email.js';
import { sendOTPEmail } from '../utils/send-otp-email.js'
import { validateOTP } from "../utils/validate-otp.js";
import { generateToken, generateRefreshToken } from '../utils/generate-token.js';
import jwt from "jsonwebtoken"


function randomOTPNumber(){
    return Math.floor(1000 + Math.random() * 9000);
}

function normalizeEmail(email) {
    // if (!email) return null;
    return email.trim().toLowerCase();
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// register admin
// create new admin account
export const registerAdminService = async ({ name, email, password }) => {

    if (!name || !email || !password) throw new Error ("All field are requiered")

    const normalizedEmail = normalizeEmail(email);

    if (!emailRegex.test(normalizedEmail)) {
        throw new Error("Invalid email format");
    }

    if (!passwordRegex.test(password)) {
        throw new Error(
            "Password must be at least 8 characters and include uppercase, lowercase, and a number"
        );
    }

    // check email avaliablility
    const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Email already registered use another email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // generate otp
    const generatedOTP = randomOTPNumber();
    // set toke expored 5 minutes
    const otpExpired = new Date(Date.now() + 5 * 60 * 1000);

    // save user
    await pool.query(
        `INSERT INTO users 
        (role_id, name, email, password, otp_code, otp_expired, email_verified)
        VALUES (1, $1, $2, $3, $4, $5, $6)`,
        [name, normalizedEmail, hashedPassword, generatedOTP, otpExpired, false]
    );

    await sendOTPEmail(normalizedEmail, generatedOTP);

    return {
        name,
        email: normalizedEmail
    };
};

// register user
// create new user account
export const registerUserService = async ({name, email, password}) => {

    if (!name || !email || !password) throw new Error ("All field requiered")

    const normalizedEmail = normalizeEmail(email);

    if (!emailRegex.test(normalizedEmail)) {
        throw new Error("Invalid email format");
    }

    if (!passwordRegex.test(password)) {
        throw new Error(
            "Password must be at least 8 characters and include uppercase, lowercase, and a number"
        );
    }

    // check email avaliablility
    const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Email already registered use another email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // generate otp
    const generatedOTP = randomOTPNumber();
    // set toke expored 5 minutes
    const otpExpired = new Date(Date.now() + 5 * 60 * 1000);

    // save user
    await pool.query(
        `INSERT INTO users 
        (role_id, name, email, password, otp_code, otp_expired, email_verified)
        VALUES (2, $1, $2, $3, $4, $5, $6)`,
        [name, normalizedEmail, hashedPassword, generatedOTP, otpExpired, false]
    );

    await sendOTPEmail(normalizedEmail, generatedOTP);

    return {
        name,
        email: normalizedEmail
    };

}


// resend otp for register
export const resendOTPRegistrationService = async ({email}) => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) throw new Error("Email is required");

    const result = await pool.query(
        `SELECT id, email_verified, last_otp_request 
        FROM users 
        WHERE email = $1`,
        [normalizedEmail]
    );

    if (result.rows.length === 0) {
        throw new Error("User not found");
    }

    const user = result.rows[0];

    if (user.email_verified) {
        throw new Error("Email already verified");
    }

    // rate 1 request per 1 minute
    if (user.last_otp_request) {
        const diff = Date.now() - new Date(user.last_otp_request).getTime();
        if (diff < 60 * 1000) {
            throw new Error("Please wait before requesting another OTP");
        }
    }

    // generate new otp
    const otp = randomOTPNumber();
    const otpExpired = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
        `UPDATE users
            SET otp_code = $1,
                otp_expired = $2,
                last_otp_request = NOW()
            WHERE email = $3`,
        [otp, otpExpired, normalizedEmail]
    );

    await sendOTPEmail(normalizedEmail, otp);

    return true;
}



// send reset password otp verification
export const sendResetPasswordOTPService = async ({email}) => {
    const normalizedEmail = normalizeEmail(email);

    const result = await pool.query(
        `SELECT id, email_verified, last_otp_request 
        FROM users 
        WHERE email = $1`,
        [normalizedEmail]
    );

    if (result.rows.length === 0) {
        throw new Error("User not found");
    }

    const user = result.rows[0];

    // rate limit 1 minute per request
    if (user.last_otp_request) {
        const diff = Date.now() - new Date(user.last_otp_request).getTime();
        const oneMinute = 60 * 1000;

        if (diff < oneMinute) {
            throw new Error("Please wait before requesting another OTP");
        }
    }

    // set otp
    const otp = randomOTPNumber();
    const otpExpired = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
        `UPDATE users 
        SET otp_code = $1, otp_expired = $2, last_otp_request = NOW()
        WHERE email = $3`,
        [otp, otpExpired, normalizedEmail]
    );

    await sendForgotPasswordOTPEmail(normalizedEmail, otp);

    return true;

}

export const resendResetPasswordOTPService = async ({ email }) => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) throw new Error("Email is required");

    const result = await pool.query(
        `SELECT id, email_verified, last_otp_request, otp_code
        FROM users 
        WHERE email = $1`,
        [normalizedEmail]
    );

    if (result.rows.length === 0) throw new Error("User not found");

    const user = result.rows[0];

    // Pastikan user memang sedang dalam proses reset password
    if (!user.otp_code) {
        throw new Error("No password reset request found, please request again");
    }

    // Rate limit 1 menit
    if (user.last_otp_request) {
        const diff = Date.now() - new Date(user.last_otp_request).getTime();
        if (diff < 60 * 1000) {
            throw new Error("Please wait before requesting another OTP");
        }
    }

    const otp = randomOTPNumber();
    const otpExpired = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
        `UPDATE users 
        SET otp_code = $1, otp_expired = $2, last_otp_request = NOW()
        WHERE email = $3`,
        [otp, otpExpired, normalizedEmail]
    );

    await sendForgotPasswordOTPEmail(normalizedEmail, otp); // ← pakai forgot password email

    return true;
};

// change password admin & user
export const changePasswordService = async ({ email, otp, password }) => {

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) throw new Error("Email is required");

    console.log(`email: ${normalizedEmail}, otp: ${otp}, password: ${password}`)

    if (!passwordRegex.test(password)) {
    throw new Error(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number"
    );
}

    // validate on validate-otp.js (on utils)
    await validateOTP({ email, otp: otp });

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
        `UPDATE users 
        SET password = $1,
            otp_code = NULL,
            otp_expired = NULL
        WHERE email = $2`,
        [hashedPassword, normalizedEmail]
    );

    return true;
};



// otp verification
export const verifyOTPService = async ({email, otp}) => {

    // validate on validate-otp.js (on utils)
    await validateOTP({ email, otp });

    await pool.query(
        `UPDATE users 
        SET email_verified = true,
            otp_code = NULL,
            otp_expired = NULL
        WHERE email = $1`,
        [email.trim().toLowerCase()]
    );

    return true;
};


// login

export const loginService = async ({ email, password }) => {

    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
        throw new Error("All fields required");
    }

    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [normalizedEmail]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error("Email or password is incorrect");
    }

    if(user.is_deleted){
        throw new Error("Account is deactivated")
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        throw new Error("Email or password is incorrect");
    }

    // check email verified
    if (user.email_verified === false) {

        const otp = randomOTPNumber();
        const otpExpired = new Date(Date.now() + 5 * 60 * 1000);

        await pool.query(
            `UPDATE users 
            SET otp_code = $1, otp_expired = $2, last_otp_request = NOW()
            WHERE email = $3`,
            [otp, otpExpired, normalizedEmail]
        );

        await sendOTPEmail(normalizedEmail, otp);

        return {
            emailVerified: false,
            message: "Email not verified. OTP sent."
        };
    }

    const token = generateToken({
        id: user.id,
        email: user.email,
        role_id: user.role_id
    });

    const refreshToken = generateRefreshToken({ 
        id: user.id, 
        email: user.email, 
        role_id: 
        user.role_id 
    });

     // Simpan refresh token ke DB
    const refreshExpired = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari
    await pool.query(
        `UPDATE users 
        SET refresh_token = $1, refresh_token_expired = $2 
        WHERE id = $3`,
        [refreshToken, refreshExpired, user.id]
    );


    return {
        emailVerified: true,
        token,
        refreshToken,
        user
    };
};


// refresh token
export const refreshTokenService = async ({ refreshToken }) => {
    if (!refreshToken) throw new Error("Refresh token required");

    // Verifikasi signature dulu
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
            issuer: "emenu-api"
        });
    } catch {
        throw new Error("Invalid or expired refresh token");
    }

    // Cek di DB: token harus cocok dan belum expired
    const result = await pool.query(
        `SELECT id, email, role_id, refresh_token, refresh_token_expired, is_deleted
         FROM users WHERE id = $1`,
        [decoded.sub]
    );

    const user = result.rows[0];

    if (!user) throw new Error("User not found");
    if (user.is_deleted) throw new Error("Account is deactivated");
    if (user.refresh_token !== refreshToken) throw new Error("Refresh token mismatch"); // cegah token lama dipakai
    if (new Date(user.refresh_token_expired) < new Date()) throw new Error("Refresh token expired, please login again");

    // Generate access token baru
    const newAccessToken = generateToken({
        id: user.id,
        email: user.email,
        role_id: user.role_id
    });

    return { token: newAccessToken };
};

// logout
export const logoutService = async ({ id }) => {
    // Hapus refresh token saat logout
    await pool.query(
        `UPDATE users SET refresh_token = NULL, refresh_token_expired = NULL WHERE id = $1`,
        [id]
    );
    return true;
};


export const getProfileDataService = async ({ user_id }) => {

    if (!user_id) throw new Error("User ID is required");

    const result = await pool.query(
        `SELECT id, name, email, role_id
        FROM users
        WHERE id = $1`,
        [user_id]
    );

    if (result.rows.length === 0) {
        throw new Error("User not found");
    }

    return {
        user: result.rows[0]
    };
};