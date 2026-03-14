import pool from '../config/db.js'

// user and admin
export const editNameService = async ({id, name}) => {

    if(!id || !name){
        throw new Error ("All field are required")
    }

    const userResult = await pool.query(
        `SELECT id, is_deleted FROM users WHERE id = $1`,
        [id]
    )

    if(userResult.rows.length === 0){
        throw new Error("User not found")
    }

    if(userResult.rows[0].is_deleted){
        throw new Error("Account is deactivated")
    }

    const result = await pool.query(
        `UPDATE users
        SET name = $2
        WHERE id = $1`,
        [id, name]
    )

    return {
        user: result.rows[0]
    }
}

// admin

export const deactivatedUserAccountAdminService = async ({ role_id, id, confirm_name }) => {

    // hanya admin boleh akses
    if (role_id !== 1) {
        throw new Error("Only admin can deactivate accounts")
    }

    if (!id || !confirm_name) {
        throw new Error("All fields are required")
    }

    // ambil user target
    const userResult = await pool.query(
        `SELECT id, name, role_id, is_deleted
        FROM users
        WHERE id = $1`,
        [id]
    )

    if (userResult.rows.length === 0) {
        throw new Error("User not found")
    }

    const targetUser = userResult.rows[0]

    // tidak boleh admin deactivate admin
    if (targetUser.role_id === 1) {
        throw new Error("Admin cannot deactivate another admin")
    }

    // cek nama konfirmasi
    if (targetUser.name.toLowerCase() !== confirm_name.toLowerCase()) {
        throw new Error("Confirmation name does not match")
    }

    if (targetUser.is_deleted) {
        throw new Error("User already deactivated")
    }

    // deactivate
    await pool.query(
        `UPDATE users
        SET is_deleted = true
        WHERE id = $1`,
        [id]
    )

    return true
}

export const activatedUserAccountAdminService = async ({role_id, id, confirm_name}) => {

     // hanya admin boleh akses
    if (role_id !== 1) {
        throw new Error("Only admin can activate accounts")
    }

    if (!id || !confirm_name) {
        throw new Error("All fields are required")
    }

    // ambil user target
    const userResult = await pool.query(
        `SELECT id, name, role_id, is_deleted
        FROM users
        WHERE id = $1`,
        [id]
    )

    if (userResult.rows.length === 0) {
        throw new Error("User not found")
    }

    const targetUser = userResult.rows[0]

    // tidak boleh admin deactivate admin
    if (targetUser.role_id === 1) {
        throw new Error("Admin cannot activate another admin")
    }

    // cek nama konfirmasi
    if (targetUser.name.toLowerCase() !== confirm_name.toLowerCase()) {
        throw new Error("Confirmation name does not match")
    }

    if (targetUser.is_deleted === false) {
        throw new Error("User already activated")
    }

    // activate
    await pool.query(
        `UPDATE users
        SET is_deleted = false
        WHERE id = $1`,
        [id]
    )

    return true
}