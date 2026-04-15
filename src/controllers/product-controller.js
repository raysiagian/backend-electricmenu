// private

import {
    createProductService, 
    getAllProductByShopIDService, 
    getAllProductByUserIDService, 
    getProductByShopIDandProductIDService, 
    getProductByProductIDService, 
    editProductService, 
    deleteProductService,
    getProductStatsByIDService, 
    getProductByProductIDAdminService, 
    getAllProductAdminService, 
    searchProductByUserIDService, 
    searchProductByShopIDService, 
    getAllProductsByShopSlugService, 
    searchProductsinShopPublicService } from "../services/product-service.js";

// User

// get product by product id

export const getProductByProductID = async (req, res) => {
    try {

        const {id} = req.params
        const user_id = req.user.sub
        
        const result = await getProductByProductIDService ({id, user_id})

        return res.status(200).json({
            product: result.product
        });

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// get specifit product by shop id and product id
export const  getProductByShopIDandProductID = async (req, res) => {
    try {
        
        const {id, shop_id} = req.params
        const user_id = req.user.sub

        const result = await getProductByShopIDandProductIDService({id, shop_id, user_id})

        return res.status(200).json({
            product: result.product
        });

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// get all product by shop id
export const getAllProductByShopID = async (req, res) => {
    try {
        
        const {shop_id} = req.params
        const user_id = req.user.sub

        // buat limit pagination
        const {
            page = 1,
            limit = 10,
            sort = "id",
            order = "DESC"
        } = req.query

        const result  = await getAllProductByShopIDService({
            shop_id, 
            user_id, 
            page: Number(page), 
            limit: Number(limit),
            sort,
            order
        })

        return res.status(200).json({
            products: result.products,
            pagination: result.pagination
        })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// get all product by user id
export const getAllProductByUserID = async (req, res) => {
    try {
        
        const user_id = req.user.sub

        // buat limit pagination
        const {
            page = 1,
            limit = 10
        } = req.query
        
        const result = await getAllProductByUserIDService({
            user_id,
            page: Number(page), 
            limit: Number(limit)
        })

        return res.status(200).json({
            products: result.products,
            pagination: result.pagination
        })

        
    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// search product created by user from manage product
export const searchProductByUserID = async (req, res) => {
    try {
        
        const user_id = req.user.sub;

        const {
            search = "",
            page = 1,
            limit = 10,
            sort = "created_at",
            order = "desc" 
        } = req.query

        const result = await searchProductByUserIDService({
            user_id,
            search,
            page: Number(page),
            limit: Number(limit),
            sort,
            order

        })

        return res.status(200).json({
            message: "Products retrieved successfully",
            products: result.products,
            pagination: result.pagination
        })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

export const searchProductByShop = async (req, res) => {
    try {
        const user_id = req.user.sub
        const {shop_id} = req.params
        const { search, page, limit, sort, order } = req.query

        const result = await searchProductByShopIDService({
            user_id,
            shop_id,
            search,
            page: Number(page),
            limit: Number(limit),
            sort,
            order
        })

        return res.status(200).json(result)

    } catch (err) {
        return res.status(400).json({
            error: err.message
        })
    }
}

// create product from manage product 
export const createProduct = async (req, res) => {
    try {
    
        const user_id = req.user.sub
        const shop_id = req.params.shop_id || req.body.shop_id
        const {product_name, type_id, service_type, product_image, price, stock} = req.body
        const file = req.file

        const result = await createProductService({
            user_id, 
            shop_id, 
            product_name, 
            type_id, 
            service_type, 
            product_image, 
            price, 
            stock,
            file
        })

        return res.status(200).json({
            message: "Product create sucessfully",
            product: result.product
        })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// edit product
export const editProduct = async (req, res) => {
    try {
        
        const user_id = req.user.sub
        const {id} = req.params
        const payload = req.body
        const file = req.file

        const result = await editProductService ({
            user_id, 
            id,
            shop_id, 
            product_name, 
            type_id, 
            service_type, 
            price, 
            stock,
            file
        })

        return res.status(200).json({
            message: "Product updated successfully",
            product: result.product
        })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// delete product
export const deleteProduct = async (req, res) => {
    try {
        
        const user_id = req.user.sub;
        const {id} = req.params
        const {confirm_product_name} = req.body

        const result = await deleteProductService({user_id, id, confirm_product_name})

        return res.status(200).json({
            message: "Product deleted sucessfully"
        });

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

export const getProductStatsByID = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.sub;

        const result = await getProductStatsByIDService({ id, user_id });

        return res.status(200).json({
            stats: result
        });

    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};


// admin

// get product by id 
export const getProductByProductIDAdmin = async (req, res) => {
    try {
        const role_id = req.user.role_id
        const {id} = req.params;

        const result = await getProductByProductIDAdminService({role_id, id})

        return res.status(200).json({
            product: result.product
        })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// get all product
export const getAllProductAdmin = async (req, res) => {
    try {
        
        const role_id = req.user.role_id

        const {
            page = 1,
            limit = 10
        } = req.query

        const result = await getAllProductAdminService({
            role_id,
            page: Number(page), 
            limit: Number(limit)
        })

        return res.status(200).json({
            products: result.products,
            pagination: result.pagination
        })

    } catch (err) {
        return res.status(400).json({
            error: err.message
        })
    }
}

// public

export const getAllProductsByShopSlug = async (req, res) => {
    try {
        const {shop_slug} = req.params

        const {
            page = 1,
            limit = 10,
            sort = "created_at",
            order = "DESC"
        } = req.query

        const result = await getAllProductsByShopSlugService({
            shop_slug,
            page: Number(page), 
            limit: Number(limit),
            sort,
            order
        })

        return res.status(200).json({
            products: result.products,
            pagination: result.pagination
        })
    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// search product in shop public

export const searchProductsinShopPublic = async (req, res) => {
    try {
        
        const {shop_slug} = req.params
        const { search, page, limit, sort, order } = req.query

        const result = await searchProductsinShopPublicService({
            shop_slug,
            search,
            page: Number(page),
            limit: Number(limit),
            sort,
            order
        })

        return res.status(200).json(result)

    } catch (err) {
        return res.status(400).json({
            error: err.message
        })
    }
}