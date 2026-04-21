import { upload } from "../middleware/upload-file.js"
import express from "express";
import { protect } from "../middleware/auth-middleware.js";
import rateLimit from "express-rate-limit";
import { createProduct, 
    getAllProductByShopID, 
    getAllProductByUserID, 
    getProductByProductID, 
    getProductByShopIDandProductID,
    searchProductByUserID,
    getProductStatsByID,
    searchProductByShop,
    updateProductAvailability,
    deleteProduct, 
    editProduct
} from "../controllers/product-controller.js";

const createProductLimiter = rateLimit({
    windowMs : 60 * 1000,
    max: 3,
    // keyGenerator: (req) => req.user.id,
    message: {
        error: "Too many product creation attempts. Please try again in 1 minute."
    }
})

const editProductLimiter = rateLimit({
    windowMs : 5 * 60 * 1000,
    max: 3,
    message: {
        error: "Too many product creation attempts. Please try again in 5 minute."
    }
})

const updateAvailabilityLimiter = rateLimit ({
    windowMs : 60 * 1000,
    max: 5,
    message: {
        error: "Too many update avaliablity attempts. Please try again in 1 minute."
    }
})

const router = express.Router()

router.post("/create-product", upload.single("product_image"),protect, createProductLimiter, createProduct)
router.get("/shop/:shop_id", protect, getAllProductByShopID)
router.get("/get-product/:id", protect, getProductByProductID)
router.get("/shop/:shop_id/product/:id", protect, getProductByShopIDandProductID)
router.get("/get-all-products", protect, getAllProductByUserID)
router.get("/search-product", protect, searchProductByUserID)
router.get("/stats/:id", protect, getProductStatsByID);
router.delete("/:id/delete-product", protect, deleteProduct)
router.get("/shop/:shop_id/search-product", protect, searchProductByShop)
router.patch("/:id/edit-product", upload.single("product_image"), protect, editProductLimiter, editProduct);
router.put("/:id/update-availability", protect,updateAvailabilityLimiter, updateProductAvailability)



export default router;