
import { changePasswordService, registerAdminService, resendOTPRegistrationService, verifyOTPService, sendResetPasswordOTPService, registerUserService, loginService, logoutService, getProfileDataService  } from '../services/auth-service.js';



// register admin
// create new admin account
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./~`]).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must contain uppercase, lowercase, number, and special character"
            });
        }

        const result = await registerAdminService({ name, email, password });

        res.status(200).json({
            message: "Admin successfully registered",
            ...result
        });

    } catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({
                message: "Email has been used"
            });
        }

        res.status(500).json({
            error: err.message
        });
    }
};


// register user
// create new user account
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./~`]).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must contain uppercase, lowercase, number, and special character"
            });
        }

        const result = await registerUserService({name, email, password});

        res.status(200).json({
            message: "User successfully registered",
            ...result
        });

    } catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({
                message: "Email has been used"
            });
        }

        res.status(500).json({
            error: err.message
        });
    }
}



// resend otp on register
// request another otp for register
export const resendRegisterOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        await resendOTPRegistrationService({ email });

        res.status(200).json({
            message: "OTP resent successfully"
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



// edit password flow

// send otp verification
export const sendResetPasswordOTP = async (req, res) => {
    try {
        
        const {email} = req.body

        if(!email){
            return res.status(400).json({message: "All fields are required"})
        }

        await sendResetPasswordOTPService({email})

        res.status(200).json({
            message: "OTP sent to email"
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// change password
export const changePassword = async (req, res) => {
    try {
        
        const {email, otp, password, confirmPassword} = req.body;

        if (!email || !otp || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./~`]).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must contain uppercase, lowercase, number, and special character"
            });
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                message: "Password and Confirm Password must be same"
            })
        }

        await changePasswordService({ email, otp, password });

        res.status(200).json({
            message: "Password successfully changed",
        });


    } catch (err) {

        if (
            err.message === "User not found" ||
            err.message === "Invalid OTP" ||
            err.message === "OTP expired"
        ) {
            return res.status(400).json({ message: err.message });
        }

        res.status(500).json({
            error: err.message
        });
    }
}



// otp verification
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
        return res.status(400).json({
            message: "Email and OTP are required"
        });
        }

        await verifyOTPService(email, otp);

        res.status(200).json({
        message: "Email verified successfully"
        });

    } catch (err) {

        if (err.message === "User not found") {
        return res.status(404).json({ message: err.message });
        }

        if (err.message === "Invalid OTP" || err.message === "OTP expired") {
        return res.status(400).json({ message: err.message });
        }

        res.status(500).json({ error: err.message });
    }
};


// login

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginService({ email, password });

        if (!result.emailVerified) {
            return res.status(403).json({
                message: result.message,
                emailVerified: false
            });
        }

        return res.status(200).json({
            message: "Login successful",
            token: result.token,
            emailVerified: true,
            user: {
                name: result.user.name,
                email: result.user.email,
                role_id: result.user.role_id,
            }
        });

        // cara lain
        // const { token, user, emailVerified, message } = await loginService({ email, password });
        // return res.status(200).json({
        //     message: "Login success",
        //     token,
        //     user: {
        //         id: user.id,
        //         name: user.name,
        //         email: user.email,
        //         role_id: user.role_id
        //     }
        // });

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
};

// logout
export const logout = async (req, res) => {
    try {
        const { id } = req.user.sub // atau ambil dari token yang sudah di-decode middleware
        await logoutService({ id });
        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await refreshTokenService({ refreshToken });
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

export const getProfileData = async (req, res) => {
    try{
        const user_id = req.user.sub;

        const result = await getProfileDataService({ user_id });

        return res.status(200).json({
            user: result.user
        });

    }catch(err){
        return res.status(400).json({
            error: err.message
        });
    }
}