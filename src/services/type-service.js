

// private

// admin

export const createTypeService = async ({type_name}) => {

    if(!type_name) throw new Error ("All field required")

    const normalizedTypeName = type_name.trim().toLowerCase()
    
    const existingTypeName = await pool.query(
        `SELECT id FROM types WHERE type_name = $1`,
        [normalizedTypeName]
    )

    if(existingTypeName.rows.length > 0) throw new Error ("Type already created")

    await pool.query(
        `INSERT INTO types (type_name) VALUES($1)`,
        [normalizedTypeName]
    )

    return {
        type_name
    }
}