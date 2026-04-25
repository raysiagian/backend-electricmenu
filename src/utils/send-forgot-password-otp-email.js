import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log("SMTP ERROR:", error);
    } else {
        console.log("SMTP READY");
    }
});


export const sendForgotPasswordOTPEmail = async (to, otp) => {
const mailOptions = {
    from: `"Electric Menu" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Forgot Password OTP Verification Code",
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Please use the OTP code below to verify your request:</p>
        
        <div style="
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 5px;
            background: #f4f4f4;
            padding: 15px;
            text-align: center;
            border-radius: 8px;
            margin: 20px 0;
            ">
            ${otp}
        </div>

        <p>This code will expire in <strong>5 minutes</strong>.</p>

        <p>If you did not request this, please ignore this email.</p>

        <hr/>
        <p style="font-size: 12px; color: gray;">
        © 2026 Electric Menu. All rights reserved.
        </p>
    </div>
    `
};

await transporter.sendMail(mailOptions);
};
