import { createShopService, editShopService, getShopService, getShopPublicService,searchShopbyUserIDService, deleteShopService,searchShopAdminService, getShopByShopIDAdminService, getAllShopAdminService, deleteShopAdminService, getShopByUserIDAdminService, getUserShopsService } from "../services/shop-service.js"


// private

// search
// searching all shop that only user have been created
export const searchShopbyUserID = async (req, res) => {
    try {
        
        const user_id = req.user.sub;
        
        const {
            search = "",
            page = 1,
            limit = 10,
            sort = "created_at",
            order = "desc"
        } = req.query

        const result = await searchShopbyUserIDService({
            user_id,
            search,
            page: Number(page),
            limit: Number(limit),
            sort,
            order
        })

        return res.status(200).json({
            message: "Shops retrieved successfully",
            shops: result.shops,
            pagination: result.pagination
        })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// get
// get all shop that only user have been created
export const getUserShops = async (req, res) => {
    try {
        
        const user_id = req.user.sub

        const result = await getUserShopsService ({user_id})

        return res.status(200).json({
            shop: result.shop
        });

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}


// create shop
export const createShop = async (req, res) => {
    try {
        
        const user_id = req.user.sub;
        const {shop_name} = req.body

        const result = await createShopService({user_id, shop_name})

        return res.status(200).json({
            message: "Shop create sucessfully",
            shop: result.shop
        })

        
    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}


// edit shop
export const editShop = async (req, res) => {
    try {
        
        const user_id = req.user.sub;
        const id = req.params.id
        const {shop_name} = req.body


        const result = await editShopService({user_id, id, shop_name})

        return res.status(200).json({
            message: "Shop updated successfully",
            shop: result.shop
        })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// get  shop
// owner get shop by id and token
export const getShop = async (req, res) => {
    try {

        const user_id = req.user.sub;
        const { id } = req.params;

        const result = await getShopService({ user_id, id });

        return res.status(200).json({
            shop: result.shop
        });

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// delete shop
// soft delete
export const deleteShop = async (req, res) => {
    try {
        
        const user_id = req.user.sub
        const {id} = req.params;
        const { confirm_shop_name } = req.body

        const result = await deleteShopService({user_id, id, confirm_shop_name})

        return res.status(200).json({
            message: "Shop deleted sucessfully"
        });

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}


// public

// get shop
export const getShopPublic = async (req, res) => {
    try {
        
        const {shop_slug} = req.params

        const result = await getShopPublicService ({shop_slug})

        return res.status(200).json({
            shop: result.shop
        });

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}


// admin

// search shop
// searching all shop that have been created
export const searchShopAdmin = async (req, res) => {
    try {
        
        const role_id = req.user.role_id;
        
        const {
            search = "",
            page = 1,
            limit = 10,
            sort = "created_at",
            order = "desc"
        } = req.query

        const result = await searchShopAdminService({
            role_id,
            search,
            page: Number(page),
            limit: Number(limit),
            sort,
            order
        })

        return res.status(200).json({
            message: "Shops retrieved successfully",
            shops: result.shops,
            pagination: result.pagination
        })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}


// get all shop
export const getAllShopAdmin = async (req, res) => {
    try {

        const role_id = req.user.role_id

        const result = await getAllShopAdminService ({role_id})

        return res.status(200).json({
            shop: result.shops
        });

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// get shop by shop id
export const getShopByShopIDAdmin = async (req, res) => {
    try {
        
        const role_id = req.user.role_id
        const {id} = req.params;

        const result = await getShopByShopIDAdminService ({role_id, id})

        return res.status(200).json({
            shop: result.shop
        });

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

export const getShopByUserIDAdmin = async (req,res) => {
    try {
        const role_id = req.user.role_id
        const {user_id} = req.params;

        const result = await getShopByUserIDAdminService ({role_id, user_id})

        return res.status(200).json({
            shops: result.shops
        })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

export const deleteShopAdmin = async (req, res) => {
    try {
        
        const role_id = req.user.role_id
        const {id} = req.params;
        const {confirm_shop_name} = req.body

        const result = await deleteShopAdminService({role_id, id, confirm_shop_name})

        return res.status(200).json({
            message: "Shop deleted sucessfully"
        });


    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
} 