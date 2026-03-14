import { activatedUserAccountAdminService, deactivatedUserAccountAdminService, editNameService } from "../services/user-service.js"


// user and admin
export const editName = async (req, res) => {
    try {
        
        const id = req.user.sub
        const {name} = req.body

        const result = await editNameService({id,name})

        return res.status(200).json({
            message: "Name successfully changed",
            user: result.user,
        })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// admin


export const deactivatedUserAccountAdmin = async (req, res) => {
    try {
        const role_id = req.user.role_id;
        const {id} = req.params;
        const {confirm_name} = req.body

        await deactivatedUserAccountAdminService({role_id, id,confirm_name})

        return res.status(200).json({
            message: "User deactivated sucessfully"
        });

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }

}

export const activatedUserAccountAdmin = async (req, res) => {
    try {
        const role_id = req.user.role_id;
        const {id} = req.params;
        const {confirm_name} = req.body

        await activatedUserAccountAdminService({role_id, id, confirm_name})

        return res.status(200).json({
            message: "User activated sucessfully"
        });

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}