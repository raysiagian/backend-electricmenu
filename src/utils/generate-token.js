import jwt from "jsonwebtoken"

export const generateToken = ({ id, email, role_id }) => {
    if (!id || !email || !role_id) throw new Error("Missing token payload data")
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined")

    return jwt.sign(
        { sub: id, email, role_id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES || "15m", 
            issuer: "emenu-api",
        }
    )
}

export const generateRefreshToken = ({ id, email, role_id }) => {
    if (!process.env.JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is not defined")

    return jwt.sign(
        { sub: id, email, role_id },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d",
            issuer: "emenu-api",
        }
    )
}