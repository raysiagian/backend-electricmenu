

// private

import { createTypeService } from "../services/type-service.js"

// admin

// create
export const createType = async (req, res) => {
    try {

        const {type_name} = req.body
        const result = await createTypeService({type_name})

        return res.status(200).json({
            message: "type retrieved successfully",
            type: result.type,
        })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// edit