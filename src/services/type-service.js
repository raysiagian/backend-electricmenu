

// private

import pool from "../config/db.js";

// admin

// create
export const createTypeService = async ({type_name, role_id}) => {

    if(!type_name) throw new Error ("All field required")

    if(role_id !== 1) throw new Error ("Only admin can acess this service")

    const normalizedTypeName = type_name.trim().toLowerCase()
    
    const existingTypeName = await pool.query(
        `SELECT id FROM types WHERE type_name = $1`,
        [normalizedTypeName]
    );


    if(existingTypeName.rows.length > 0) throw new Error ("Type already created")

    await pool.query(
        `INSERT INTO types (type_name) VALUES($1)`,
        [normalizedTypeName]
    )

    return {
        type_name
    }
}


// edit
export const editTypeService = async ({id, type_name, role_id}) => {

    if(!id || !type_name) throw new Error ("All fields required")
    
    if(role_id !== 1) throw new Error ("Only admin can acess this service")
    
    const normalizedTypeName = type_name.trim().toLowerCase()

    // check type dengan id
    const typeResult = await pool.query(
        `SELECT id FROM types WHERE id = $1`,
        [id]
    )

    if(typeResult.rows.length === 0) throw new Error ("Type not found or not authorized")

    // check apakah nama baru sudah pernah ada

    const existingTypeName = await pool.query(
        `SELECT id FROM types WHERE type_name = $1 AND id != $2`,
        [normalizedTypeName, id]
    );

    if(existingTypeName.rows.length > 0) throw new Error ("Type already created")

    await pool.query(
        `UPDATE types SET type_name= $2 WHERE id = $1`,
        [id, normalizedTypeName]
    )

    return {
        type_name: normalizedTypeName
    }
}

// delete

export const deleteTypeService = async ({id, confirm_type_name, role_id}) => {

    if(!id || !confirm_type_name) throw new Error ("All fields required")

    if(role_id !== 1) throw new Error ("Only admin can acess this service")
    
    const  typeResult = await pool.query(
        `SELECT id, type_name FROM types WHERE id = $1`,
        [id]
    )

    const normalizedTypeNameConfirm = confirm_type_name.trim().toLowerCase();


    if(typeResult.rows.length === 0) throw new Error ("Type not found or not authorized")

    const type = typeResult.rows[0]

    if(type.type_name.trim().toLowerCase() !== normalizedTypeNameConfirm) throw new Error ("Type name confirmation does not match")
    
    await pool.query(
        `DELETE FROM types WHERE id = $1`,
        [id]
    )

    return { success: true }
}

// get
export const getTypeByIDService = async ({id, role_id}) => {
    
    if(!id) throw new Error ("Type id is required")
    if(role_id !== 1) throw new Error ("Only admin can acess this service")
    
    const result = await pool.query(
        `SELECT type_name FROM types WHERE id = $1`,
        [id]
    )

    if(result.rows.length === 0) throw new Error ("Type not found")

    return {
        type: result.rows[0]
    }
    
}

// search
export const searchTypeService = async ({role_id, search, page, limit}) => {

    if(role_id !== 1) throw new Error ("Only admin can acess this service")

    if (!search || search.trim() === "") {return []}


    const offset = (page - 1) * limit

    const normalizedSearch = search.trim().toLowerCase()

    const result = await pool.query(
        `SELECT id, type_name FROM types WHERE type_name ILIKE $1 LIMIT $2 OFFSET $3`,
        [`%${normalizedSearch}%`, limit, offset ]
    )

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM types WHERE type_name ILIKE $1`,
        [`%${normalizedSearch}%`]
    )

    const total = parseInt(countResult.rows[0].count)

    return{
        types: result.rows,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }
}

export const searchTypeDropdownUserService = async ({search}) => {

    if(!search || search.trim() === "") {return []}

    const normalizedSearch = search.trim().toLowerCase()

    const result = await pool.query(
        `SELECT type_name FROM types WHERE type_name ILIKE $1 ORDER BY type_name ASC LIMIT 10`,
        [`%${normalizedSearch}%`]
    )

    return result.rows

} 