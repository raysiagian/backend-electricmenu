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


export const removeProductEmail = async (to, productName) => {
    const mailOptions = {
        from: `"Electric Menu" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Product Removed from Your Shop",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #d9534f;">Product Removed</h2>

            <p>Hello,</p>

            <p>
                We would like to inform you that the following product has been 
                <strong>removed</strong> from your shop:
            </p>

            <div style="
                font-size: 20px;
                font-weight: bold;
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
            ">
                ${productName}
            </div>

            <p>
                This action was performed by an administrator. If you believe this was done in error
                or you need further clarification, please contact support.
            </p>

            <p>Thank you for using <strong>Electric Menu</strong>.</p>

            <hr/>

            <p style="font-size: 12px; color: gray;">
                © 2026 Electric Menu. All rights reserved.
            </p>
        </div>
        `
    };

    await transporter.sendMail(mailOptions);
};