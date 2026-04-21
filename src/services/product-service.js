import pool from '../config/db.js'
import {generateProductSlugify} from '../utils/generate-slug.js'
import {generateHashID} from '../utils/generate-hash-id.js'
import { BASE_URL,  UPLOAD_PATH } from "../config/app-config.js";
import path from "path"
import fs from "fs"
import { error } from 'console';

// private

// User

// get product by product id
export const getProductByProductIDService = async ({id, user_id}) => {

    if(!id || !user_id) throw new Error ("All field required")
    
    // get data
    const result = await pool.query(
        `SELECT 
            p.id,
            p.product_name,
            p.service_type,
            p.price,
            p.stock,
            p.product_image_url,
            COALESCE(t.type_name, 'Uncategorized') as type_name
        FROM products p
        JOIN shops s ON p.shop_id = s.id
        LEFT JOIN types t ON p.type_id = t.id
        WHERE p.id = $1
        AND s.user_id = $2
        AND p.is_deleted = false
        AND s.is_deleted = false`,
        [id, user_id]
    )

    if (result.rows.length === 0) {
        throw new Error("Product not found or not authorized");
    }

    return {
        product: result.rows[0]
    };

}

// get specifit product by shop id and product id
export const getProductByShopIDandProductIDService = async ({id, shop_id, user_id}) => {

    if(!id || !shop_id || !user_id) throw new Error ("All field required")

    // validasi shop kepemilikan user
    const shopCheck = await pool.query(
        `SELECT id FROM shops WHERE id = $1 AND user_id = $2 AND is_deleted = false`,
        [shop_id, user_id]
    )
    
    if (shopCheck.rows.length === 0) {
        throw new Error("Shop not found or not authorized")
    }


    // mengambil product join dengan shop (hanya product yang memiliki shop_id yang ditampilkan)
    // left hoin types (menampilkan product walaupun type nilainya null)
    const result = await pool.query(
        `SELECT 
            p.id,
            p.product_name,
            p.product_slug,
            p.service_type,
            p.price,
            p.stock,
            p.product_image_url,
            p.is_available,
            COALESCE(t.type_name, 'No Type') as type_name
        FROM products p
        JOIN shops s ON p.shop_id = s.id
        LEFT JOIN types t ON p.type_id = t.id
        WHERE s.user_id = $3
        AND p.id = $1
        AND s.id = $2
        AND p.is_deleted = false
        AND s.is_deleted = false`,
        [id, shop_id, user_id]
    )

    if (result.rows.length === 0) {
        throw new Error("Product not found or not authorized");
    }

    return {
        product: result.rows[0]
    };
}

// get all product by specifit shop id
export const getAllProductByShopIDService = async ({
    shop_id, 
    user_id, 
    page = 1, 
    limit = 10, 
    sort, 
    order
}) => {

    if(!shop_id || !user_id) throw new Error ("All field required")

    const offset = (page - 1) * limit;

    const allowedSort = ["created_at", "price", "product_name", "stock"];
    const allowedOrder = ["ASC", "DESC"];
    const safeSort = allowedSort.includes(sort) ? sort : "created_at";
    const safeOrder = allowedOrder.includes(order.toUpperCase()) ? order.toUpperCase() : "DESC";

    // validasi shop kepemilikan user
    const shopCheck = await pool.query(
        `SELECT id FROM shops WHERE id = $1 AND user_id = $2 AND is_deleted = false`,
        [shop_id, user_id]
    )
    
    if (shopCheck.rows.length === 0) {
        throw new Error("Shop not found or not authorized")
    }

    
    // get data
    const result = await pool.query(
        `SELECT 
            p.id,
            p.product_name,
            p.product_slug,
            p.service_type,
            p.price,
            p.stock,
            p.product_image_url,
            p.is_available,
            COALESCE(t.type_name, 'Uncategorized') as type_name
        FROM products p
        LEFT JOIN types t ON p.type_id = t.id
        WHERE p.shop_id = $1
        AND p.is_deleted = false
        ORDER BY p.${safeSort} ${safeOrder}
        LIMIT $2 OFFSET $3`,
        [shop_id, limit, offset]
    )

    // hitung buat pagination
    const countResult = await pool.query(
        `SELECT COUNT(*) 
        FROM products 
        WHERE shop_id = $1 
        AND is_deleted = false`,
        [shop_id]
    )

    const total = parseInt(countResult.rows[0].count)

    return {
        products: result.rows,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

// get all product by user id
export const getAllProductByUserIDService = async({user_id, page, limit}) => {
    
    if(!user_id) throw new Error ("All field required")

    const offset = (page - 1) * limit
    
    // get data
    const result = await pool.query(
        `SELECT 
            p.id,
            p.product_name,
            p.product_slug,
            p.service_type,
            p.price,
            p.stock,
            p.product_image_url,
            COALESCE(t.type_name, 'Uncategorized') as type_name
        FROM products p
        JOIN shops s ON p.shops_id = s.id
        LEFT JOIN types t ON p.type_id = t.id
        WHERE s.user_id = $1
        AND p.is_deleted = false
        AND s.is_deleted = false
        ORDER BY p.created_at DESC
        LIMIT $2 OFFSET $3`,
        [user_id, limit, offset]
    )

    const countResult = await pool.query(
        `SELECT COUNT(*) 
        FROM products p
        JOIN shops s ON p.shop_id = s.id
        WHERE s.user_id = $1
        AND p.is_deleted = false
        AND s.is_deleted = false`,
        [user_id]
    )

    const total = parseInt(countResult.rows[0].count)

    return {
        products: result.rows,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };

}

// search product created by user from manage product
export const searchProductByUserIDService = async({
    user_id, 
    search, 
    page, 
    limit, 
    sort, 
    order
}) => {
    const offset = (page - 1) * limit

    const allowedSort = ["created_at", "shop_name"]
    const allowedOrder = ["asc", "desc"]

    const sortField = allowedSort.includes(sort) ? sort : "created_at"
    const sortOrder = allowedOrder.includes(order.toLowerCase()) ? order : "desc"

    const searchQuery = `%${search}%`

    const result = await pool.query(
        `SELECT 
            p.id, 
            p.product_name, 
            p.product_slug, 
            p.product_image_url, 
            p.stock, 
            p.price, 
            p.created_at
        FROM products p
        JOIN shops s ON p.shop_id = s.id
        WHERE s.user_id = $1
        AND p.is_deleted = false
        AND s.is_deleted = false
        AND (
            p.product_name ILIKE $2
        )
        ORDER BY ${sortField} ${sortOrder}
        LIMIT $3 OFFSET $4`,
        [user_id, searchQuery, limit, offset]
    )

    const count = await pool.query(
        `SELECT COUNT(*) 
        FROM products p
        JOIN shops s ON p.shop_id = s.id
        WHERE s.user_id = $1
        AND p.is_deleted = false
        AND s.is_deleted = false
        AND (
            p.product_name ILIKE $2
        )`,
        [user_id, searchQuery]
    )

    const total = Number(count.rows[0].count)

    return {
        products: result.rows,
        pagination: {
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit)
        }
    }
}

export const searchProductByShopIDService = async ({
    user_id,
    shop_id,
    search = "",
    page = 1,
    limit = 10,
    sort = "created_at",
    order = "desc"
}) => {

    if (!user_id || !shop_id) {
        throw new Error("user_id and shop_id are required")
    }

    const offset = (page - 1) * limit

    const allowedSort = ["created_at", "product_name", "price"]
    const allowedOrder = ["asc", "desc"]

    const sortField = allowedSort.includes(sort) ? sort : "created_at"
    const sortOrder = allowedOrder.includes(order?.toLowerCase()) ? order : "desc"

    const searchQuery = `%${search}%`

    // VALIDASI SHOP MILIK USER
    const shopCheck = await pool.query(
        `SELECT id 
        FROM shops 
        WHERE id = $1 
        AND user_id = $2 
        AND is_deleted = false`,
        [shop_id, user_id]
    )

    if (shopCheck.rows.length === 0) {
        throw new Error("Shop not found or not authorized")
    }

    const result = await pool.query(
        `SELECT 
            id,
            product_name,
            product_slug,
            product_image_url,
            price,
            stock,
            created_at
        FROM products
        WHERE shop_id = $1
        AND is_deleted = false
        AND (
            product_name ILIKE $2
        )
        ORDER BY ${sortField} ${sortOrder}
        LIMIT $3 OFFSET $4`,
        [shop_id, searchQuery, limit, offset]
    )

    // COUNT
    const count = await pool.query(
        `SELECT COUNT(*)
        FROM products
        WHERE shop_id = $1
        AND is_deleted = false
        AND (
            product_name ILIKE $2
        )`,
        [shop_id, searchQuery]
    )

    const total = Number(count.rows[0].count)

    return {
        products: result.rows,
        pagination: {
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit)
        }
    }
}

// create product from manage product
export const createProductService = async ({
    user_id,
    shop_id,
    product_name,
    type_id,
    service_type,
    price,
    stock,
    file
}) => {

    // Validasi input
    if (!user_id || !shop_id || !product_name || !service_type || !price) {
        throw new Error("All fields required");
    }

    if (!file) {
        throw new Error("Product image is required");
    }

    const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error("Invalid image file type");
    }

    if (file.size > 2 * 1024 * 1024) {
        throw new Error("File too large (max 2MB)");
    }

    // ← validasi enum sesuai database
    const allowedServiceType = ["product", "service"];
    if (!allowedServiceType.includes(service_type)) {
        throw new Error("Invalid service type");
    }

    // Validasi shop
    const shopCheck = await pool.query(
        `SELECT id FROM shops 
        WHERE id = $1 AND user_id = $2 AND is_deleted = false`,
        [shop_id, user_id]
    );
    

    if (shopCheck.rows.length === 0) {
        throw new Error("Shop not found or not authorized");
    }

    // Setelah validasi shop, sebelum prepare file
    const normalizedName = product_name.trim().toLowerCase().replace(/\s+/g, ' ');

    // Duplicate check pakai normalized name
    const duplicateCheck = await pool.query(
        `SELECT id FROM products 
        WHERE shop_id = $1 
        AND product_name_normalized = $2 
        AND is_deleted = false`,
        [shop_id, normalizedName]
    );

    if (duplicateCheck.rows.length > 0) {
        throw new Error("Product with similar name already exists in this shop");
    }


    // PREPARE FILE
    const uploadDir = path.join(process.cwd(), UPLOAD_PATH.PRODUCT);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const mimeToExt = {
        "image/png": "png",
        "image/jpeg": "jpeg",
        "image/jpg": "jpg"
    };

    const ext = mimeToExt[file.mimetype];

    // temporary id untuk nama file (timestamp dulu)
    const tempName = Date.now();

    const fileName = `product-${tempName}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const product_image_url = `${BASE_URL}/product/${fileName}`;

    // INSERT (SUDAH ADA IMAGE)
    const result = await pool.query(
        `INSERT INTO products 
        (shop_id, type_id, product_name, product_name_normalized, product_slug, product_image_url, price, service_type, stock)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, product_name, price, service_type, stock, product_slug, product_image_url`,
        [
            shop_id,
            type_id || null,
            product_name,
            normalizedName, 
            "temp-slug", // sementara
            product_image_url,
            price,
            service_type,
            stock || null
        ]
    );

    const id = result.rows[0].id;


    // UPDATE SLUG FINAL
    const product_slug = `${generateProductSlugify(product_name)}.${generateHashID(id)}`;

    await pool.query(
        `UPDATE products
        SET product_slug = $1
        WHERE id = $2`,
        [product_slug, id]
    );

    return {
        product: {
            ...result.rows[0],
            product_slug
        }
    };
};

// edit product
export const editProductService = async ({ id, user_id, payload, file }) => {
    // Validasi input utama
    if (!id || !user_id) {
        throw new Error("ID and user_id are required");
    }

    // Cek apakah produk ada dan milik user yang benar
    const checkProduct = await pool.query(
        `SELECT p.*, s.user_id 
        FROM products p
        JOIN shops s ON p.shop_id = s.id
        WHERE p.id = $1
        AND s.user_id = $2
        AND p.is_deleted = false
        AND s.is_deleted = false`,
        [id, user_id]
    );

    if (checkProduct.rows.length === 0) {
        throw new Error("Product not found or not authorized");
    }

    // Simpan data produk lama
    const oldProduct = checkProduct.rows[0];

    // Validasi enum service_type
    if (
        payload.service_type &&
        !["products", "service"].includes(payload.service_type)
    ) {
        throw new Error("Invalid service type");
    }

    // Field yang boleh diupdate
    const allowedFields = [
        "product_name",
        "type_id",
        "service_type",
        "price",
        "stock",
        "is_available"
    ];

    const updates = [];
    const values = [];
    let index = 1;

    // Loop payload untuk build query update secara dinamis
    for (const key of Object.keys(payload)) {
        if (allowedFields.includes(key)) {
            updates.push(`${key} = $${index}`);
            values.push(payload[key]);
            index++;
        }
    }

    // Handle update gambar produk
    let product_image_url = oldProduct.product_image_url;

    if (file) {
        // Validasi file harus image
        if (!file.mimetype.startsWith("image/")) {
            throw new Error("File must be an image");
        }

        // Pastikan folder upload tersedia
        const uploadDir = path.join(process.cwd(), "uploads/products");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Tentukan nama file dan path
        const ext = file.mimetype.split("/")[1];
        const fileName = `product-${id}-${Date.now()}.${ext}`;
        const filePath = path.join(uploadDir, fileName);

        // Simpan file baru
        fs.writeFileSync(filePath, file.buffer);

        // Generate URL baru
        product_image_url = `${BASE_URL}/uploads/products/${fileName}`;

        // Hapus file lama jika ada
        if (oldProduct.product_image_url) {
            try {
                const oldPath = path.join(
                    process.cwd(),
                    oldProduct.product_image_url.replace(`${BASE_URL}/`, "")
                );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            } catch (err) {
                console.warn("Failed to delete old image:", err.message);
            }
        }

        // Tambahkan ke query update
        updates.push(`product_image_url = $${index}`);
        values.push(product_image_url);
        index++;
    }

    // Handle slug jika nama produk berubah
    if (payload.product_name) {
        const product_slug = `${generateProductSlugify(payload.product_name)}.${generateHashID(id)}`;

        updates.push(`product_slug = $${index}`);
        values.push(product_slug);
        index++;
    }

    // Jika tidak ada field yang diupdate
    if (updates.length === 0) {
        throw new Error("No valid fields to update");
    }

    // Tambahkan id ke parameter terakhir
    values.push(id);

    // Query update
    const query = `
        UPDATE products
        SET ${updates.join(", ")}, updated_at = NOW()
        WHERE id = $${index}
        RETURNING id, product_name, price, service_type, stock, product_slug, product_image_url
    `;

    // Eksekusi query
    const result = await pool.query(query, values);

    return {
        product: result.rows[0]
    };
};

export const deleteProductService = async ({ user_id, id, confirm_product_name }) => {
    // Validasi input
    if (!user_id || !id || !confirm_product_name) {
        throw new Error("All fields are required");
    }

    // Cek apakah produk ada dan milik user
    const productResult = await pool.query(
        `SELECT p.id, p.product_name
         FROM products p
         JOIN shops s ON p.shop_id = s.id
         WHERE p.id = $1
         AND s.user_id = $2
         AND p.is_deleted = false
         AND s.is_deleted = false`,
        [id, user_id]
    );

    if (productResult.rows.length === 0) {
        throw new Error("Product not found or not authorized");
    }

    const product = productResult.rows[0];

    // Validasi nama produk untuk konfirmasi delete
    if (
        product.product_name.trim().toLowerCase() !==
        confirm_product_name.trim().toLowerCase()
    ) {
        throw new Error("Product confirmation name does not match");
    }

    // Soft delete (tidak benar-benar hapus data)
    await pool.query(
        `UPDATE products
        SET is_deleted = true,
        updated_at = NOW()
        WHERE id = $1`,
        [id]
    );

    return {
        success: true
    };
};


export const getProductStatsByIDService = async ({ id, user_id }) => {
    if (!id) throw new Error("Product id is required");

    // Validasi produk milik user
    const productCheck = await pool.query(
        `SELECT 
            p.id,
            p.product_name,
            p.price,
            p.stock,
            p.service_type,
            p.is_available
        FROM products p
        JOIN shops s ON s.id = p.shop_id
        WHERE p.id = $1 
        AND s.user_id = $2 
        AND p.is_deleted = false`,
        [id, user_id]
    );

    if (productCheck.rows.length === 0) {
        throw new Error("Product not found or not authorized");
    }

    const product = productCheck.rows[0];

    // Hitung total quantity dan total pendapatan dari order yang done
    const statsResult = await pool.query(
        `SELECT 
            COALESCE(SUM(oi.quantity), 0) AS total_quantity,
            COALESCE(SUM(oi.total_price), 0) AS total_revenue
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE oi.product_id = $1
        AND o.status = 'done'`,
        [id]
    );

    const stats = statsResult.rows[0];

    return {
        product_id: product.id,
        product_name: product.product_name,
        price: product.price,
        stock: product.stock,
        service_type: product.service_type,
        is_available: product.is_available,
        total_quantity: parseInt(stats.total_quantity),
        total_revenue: parseFloat(stats.total_revenue)
    };
};

export const updateProductAvailabilityService = async ({user_id, id}) => {

    if(!user_id ||  !id) throw new Error ("All field required")


    const checkProduct = await pool.query(
        `SELECT 
            p.id,
            p.shop_id,
            p.is_available
        FROM products p
        JOIN shops s ON s.id = p.shop_id
        WHERE p.id = $1 
        AND s.user_id = $2 
        AND p.is_deleted = false`,
        [id, user_id]
    );
    
    console.log("checkProduct rows:", checkProduct.rows); // ← tambahkan ini
    console.log("params:", [id, user_id]);                // ← tambahkan ini

    if(checkProduct.rows.length === 0) throw new Error ("Product not found or not authorized")
    
    const product = checkProduct.rows[0];
    // console.log("CHECK PRODUCT:", checkProduct.rows)

    const shop_id = product.shop_id

    // kebalikan data saat ini
    const newAvailability = !product.is_available;

    const updated = await pool.query(
        `UPDATE products
        SET is_available = $1,
        updated_at = NOW()
        WHERE id = $2
        AND shop_id = $3
        RETURNING id, is_available`,
        [newAvailability, id, shop_id,]
    );

    console.log("ID:", id)
    console.log("SHOP_ID:", shop_id)

    return{
        product: updated.rows[0]
    }
}

// admin

// get product by product id for admin
export const getProductByProductIDAdminService = async ({role_id, id}) => {

    if(!role_id || !id) throw new Error ("All field  are required")

    if(role_id !== 1) throw new Error ("Only admin can access this service")

    const result = await pool.query(
        `SELECT id, product_name, shop_id, type_id, service_type, price, stock, product_image_url
        WHERE id = $1
        AND is_deleted = false`,
        [id]
    )

    if(result.rows.length === 0) throw new Error ("Product not found")

    return{
        product: result.rows[0]
    }

}

export const getAllProductAdminService = async({role_id, page, limit}) => {

    if(!role_id) throw new Error ("All field  are required")

    if(role_id !== 1) throw new Error ("Only admin can access this service")

    const result = await pool.query(
        `SELECT 
            p.id,
            p.product_name,
            p.product_slug,
            p.service_type,
            p.price,
            p.stock,
            p.product_image_url,
            COALESCE(t.type_name, 'Uncategorized') as type_name
        FROM products p
        JOIN shops s ON p.shops_id = s.id
        LEFT JOIN types t ON p.type_id = t.id
        WHERE p.is_deleted = false
        AND s.is_deleted = false
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2`,
        [limit, offset]
    );
    
    return {
        products: result.rows
    }

}


// public

export const getAllProductsByShopSlugService = async ({
    shop_slug,
    page = 1, 
    limit = 10, 
    sort, 
    order
}) => {

    if(!shop_slug) throw new Error ("All field required")

    const offset = (page - 1) * limit;

    
    const allowedSort = ["created_at", "price", "product_name", "stock"];
    const allowedOrder = ["ASC", "DESC"];
    const safeSort = allowedSort.includes(sort) ? sort : "created_at";
    const safeOrder = allowedOrder.includes(order.toUpperCase()) ? order.toUpperCase() : "DESC";


    const shopCheck = await pool.query(
        `SELECT id FROM shops WHERE shop_slug = $1 AND is_deleted = false`,
        [shop_slug]
    )

    if (shopCheck.rows.length === 0) {
        throw new Error("Shop not found or not authorized")
    }

    const shop_id = shopCheck.rows[0].id;

    const result = await pool.query(
        `SELECT 
            p.id,
            p.product_name,
            p.product_slug,
            p.service_type,
            p.price,
            p.stock,
            p.product_image_url,
            COALESCE(t.type_name, 'Uncategorized') as type_name
        FROM products p
        LEFT JOIN types t ON p.type_id = t.id
        WHERE p.shop_id = $1
        AND p.is_deleted = false
        ORDER BY p.${safeSort} ${safeOrder}
        LIMIT $2 OFFSET $3`,
        [shop_id, limit, offset]
    )

    const countResult = await pool.query(
        `SELECT COUNT(*) 
        FROM products 
        WHERE shop_id = $1 AND is_deleted = false`,
        [shop_id]
    );

    
    const total = parseInt(countResult.rows[0].count)

    return {
        products: result.rows,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export const searchProductsinShopPublicService = async ({
    shop_slug,
    search = "",
    page = 1,
    limit = 10,
    sort = "created_at",
    order = "desc"
}) => {

    if(!shop_slug){
        throw new Error("shop slug is required")
    }

    const offset = (page - 1) * limit

    const allowedSort = ["created_at", "product_name", "price"]
    const allowedOrder = ["asc", "desc"]

    const sortField = allowedSort.includes(sort) ? sort : "created_at"
    const sortOrder = allowedOrder.includes(order?.toLowerCase()) ? order : "desc"

    const searchQuery = `%${search}%`

    // validasi shop
    const shopCheck = await pool.query(
        `SELECT id FROM shops WHERE shop_slug = $1 AND is_deleted = false`,
        [shop_slug]
    )

    if(shopCheck.rows.length === 0){
        throw new Error("Shop not found")
    }

    const shop_id = shopCheck.rows[0].id

    const result = await pool.query(
        `SELECT 
            id,
            product_name,
            product_slug,
            product_image_url,
            price,
            stock,
            created_at
        FROM products
        WHERE shop_id = $1
        AND is_deleted = false
        AND (
            product_name ILIKE $2
        )
        ORDER BY ${sortField} ${sortOrder}
        LIMIT $3 OFFSET $4`,
        [shop_id, searchQuery, limit, offset]
    )

    // COUNT
    const count = await pool.query(
        `SELECT COUNT(*)
        FROM products
        WHERE shop_id = $1
        AND is_deleted = false
        AND (
            product_name ILIKE $2
        )`,
        [shop_id, searchQuery]
    )

    const total = Number(count.rows[0].count)

    return {
        products: result.rows,
        pagination: {
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit)
        }
    }

}