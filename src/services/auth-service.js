import bcrypt from 'bcryptjs'
import pool from '../config/db.js'
import { sendOTPEmail } from '../utils/send-otp-email.js'
import { validateOTP } from "../utils/validate-otp.js";
import { generateToken } from '../utils/generate-token.js';


function randomOTPNumber(){
    return Math.floor(1000 + Math.random() * 9000);
}

function normalizeEmail(email) {
    if (!email) return null;
    return email.trim().toLowerCase();
}

// register admin
// create new admin account
export const registerAdminService = async ({ name, email, password }) => {

    const normalizedEmail = normalizeEmail(email);

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
    const normalizedEmail = normalizeEmail(email);

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

    await sendOTPEmail(normalizedEmail, otp);

    return true;

}

// change password admin & user
export const changePasswordService = async ({ email, otp, password }) => {

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) throw new Error("Email is required");

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
export const verifyOTPService = async (email, otp) => {

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
        throw new Error("All fields are required");
    }

    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [normalizedEmail]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error("Email or password is incorrect");
    }

    if(!user){
        throw new Error("User not found")
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

    return {
        emailVerified: true,
        token,
        user
    };
};