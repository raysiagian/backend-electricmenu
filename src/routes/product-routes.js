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
    deleteProduct 
} from "../controllers/product-controller.js";

const createProductLimiter = rateLimit({
    windowMs : 60 * 1000,
    max: 3,
    message: {
        error: "You can  only change your name once a week"
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



export default router;