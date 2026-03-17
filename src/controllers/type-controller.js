

// private

import { createTypeService, deleteTypeService, editTypeService, getTypeByIDService, searchTypeDropdownUserService, searchTypeService } from "../services/type-service.js"

// admin

// create
export const createType = async (req, res) => {
    try {

        const {type_name} = req.body
        const role_id = req.user.role_id

        const result = await createTypeService({type_name, role_id})

        return res.status(200).json({
            message: "Type created successfully",
            type: result.type,
        })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// edit
export const editType = async (req, res) => {
    try {
        const {id} = req.params;
        const {type_name} = req.body;
        const role_id = req.user.role_id
        
        const result = await editTypeService({id, type_name, role_id})

        return res.status(200).json({
            message: "Type name sucessfully edited",
            type_name: result.type_name
        })


    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// delete
export const deleteType = async (req, res) => {
    try {
        const {id} = req.params;
        const {confirm_type_name} = req.body;
        const role_id = req.user.role_id

        const result = await deleteTypeService({id, confirm_type_name, role_id})

        return res.status(200).json({
            message: "Type deleted successfully",
            result
        });

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// get
export const getTypeByID = async (req, res) => {
    try {
        
        const {id} = req.params
        const role_id = req.user.role_id    

        const result = await getTypeByIDService({id, role_id})

        return res.status(200).json({
            message: "Type retrieved successfully",
            type: result.type
        });

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// search
export const searchType = async (req, res) => {
    try {
        
        const role_id = req.user.role_id
        
        const {
            search = "",
            page = 1,
            limit = 10,        
        } = req.query

    const result = await searchTypeService ({
        role_id,
        search,
        page: Number(page),
        limit: Number(limit),
    })

    return res.status(200).json({
        message: "Type retrieved successfully",
        types: result.types,
        pagination: result.pagination
    })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}


// search dropdown for user
export const  searchTypeDropdownUser = async (req, res) => {
    try {
        
        const {search} = req.query

        const result = await searchTypeDropdownUserService({search})

        return res.status(200).json({
            message: "Type retrieved successfully",
            result
        })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}