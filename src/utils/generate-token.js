import jwt from "jsonwebtoken"

export const generateToken = ({ id, email, role_id }) => {
    if (!id || !email || !role_id) {
        throw new Error("Missing token payload data")
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined")
    }

    return jwt.sign(
        {
            sub: id,
            email,
            role_id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES || "1h",
            issuer: "emenu-api",
        }
    )
}