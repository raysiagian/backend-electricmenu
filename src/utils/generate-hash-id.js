import crypto from 'crypto'

export const generateHashID = (id) => {

    return crypto.createHash("sha256")
        .update(id.toString())
        .digest("hex")
        .slice(0, 8)

}