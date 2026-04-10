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


export const orderNotificationEmail = async ({ ownerEmail, shopName, buyerName, items, grandTotal }) => {
    const itemRows = items.map(i => `
        <tr>
            <td>${i.product_name}</td>
            <td>${i.quantity}</td>
            <td>Rp.${i.total_price}</td>
        </tr>
    `).join("");

    const mailOptions = {
        from: `"Electric Menu" <${process.env.EMAIL_USER}>`,
        to: ownerEmail,
        subject: `Order Baru Masuk dari - ${shopName}`,
        html: `
            <h2>Order Baru dari ${buyerName}</h2>
            <table border="1" cellpadding="8">
                <thead>
                    <tr>
                        <th>Produk</th>
                        <th>Qty</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemRows}
                </tbody>
            </table>
            <p><strong>Grand Total: Rp.${grandTotal}</strong></p>
        `
    };

    await transporter.sendMail(mailOptions);
};