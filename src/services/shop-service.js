import pool from '../config/db.js'
import {generateShopSlugify} from '../utils/generate-slug.js'
import {generateHashID} from '../utils/generate-hash-id.js'
import { BASE_URL,  UPLOAD_PATH } from "../config/app-config.js";
import qr from "qr-image";
import fs from "fs";
import path from "path"
import { error } from 'console';


// private


// search
// searching shop that only user have been created
export const searchShopbyUserIDService = async ({user_id, search, page, limit, sort, order}) => {

    const offset = (page - 1) * limit

    const allowedSort = ["created_at", "shop_name"]
    const allowedOrder = ["asc", "desc"]

    const sortField = allowedSort.includes(sort) ? sort : "created_at"
    const sortOrder = allowedOrder.includes(order.toLowerCase()) ? order : "desc"

    const result = await pool.query(
        `SELECT id, shop_name, shop_slug, qr_url, created_at
        FROM shops
        WHERE user_id = $1
        AND is_deleted = false
        AND shop_name ILIKE $2
        ORDER BY ${sortField} ${sortOrder}
        LIMIT $3 OFFSET $4`,
        [user_id, `%${search}%`, limit, offset]
    )

    const count = await pool.query(
        `SELECT COUNT(*) 
        FROM shops
        WHERE user_id = $1
        AND shop_name ILIKE $2`,
        [user_id, `%${search}%`]
    )

    const total = Number(count.rows[0].count)

    return {
        shops: result.rows,
        pagination: {
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit)
        }
    }
}

// create shop
export const createShopService = async ({user_id, shop_name}) => {

    if(!user_id || !shop_name || !shop_name.trim()) throw new Error("All field are required");

    const result = await pool.query(
        `INSERT INTO shops (user_id, shop_name, shop_slug, qr_url)
        VALUES($1, $2, '', '')
        RETURNING id`,
        [user_id, shop_name]
    )
    
    const id = result.rows[0].id

    const shop_slug = `${generateShopSlugify(shop_name)}-${generateHashID(id)}`
    const shop_url = `${BASE_URL}/api/shop/${shop_slug}`;
    const qr_path = path.join(process.cwd(), UPLOAD_PATH.QR, `${shop_slug}.png`);
    const qr_image = qr.imageSync(shop_url, { type: "png" });
    const qr_url = `${BASE_URL}/qr/${shop_slug}.png`;
    fs.writeFileSync(qr_path, qr_image);


    await pool.query(
        `UPDATE shops
        SET shop_slug = $1, qr_url = $2
        WHERE id = $3`,
        [shop_slug, qr_url, id]
    )

    return {
        shop: {
            shop_name,
            shop_slug,
            qr_url
        }
    };
}

// edit shop

export const editShopService = async ({ user_id, id, shop_name }) => {

    if (!id || !shop_name || !shop_name.trim()) {
        throw new Error("All fields are required")
    }

    // cek apakah shop milik user
    const shopResult = await pool.query(
        `SELECT id FROM shops WHERE id = $1 AND user_id = $2 AND is_deleted = false`,
        [id, user_id]
    )

    if (shopResult.rows.length === 0) {
        throw new Error("Shop not found or not authorized")
    }

    const shop_slug = `${generateShopSlugify(shop_name)}-${generateHashID(id)}`
    const shop_url = `${BASE_URL}/api/shop/${shop_slug}`

    const qr_path = path.join(process.cwd(), UPLOAD_PATH.QR, `${shop_slug}.png`)
    const qr_image = qr.imageSync(shop_url, { type: "png" })

    const qr_url = `${BASE_URL}/qr/${shop_slug}.png`

    fs.writeFileSync(qr_path, qr_image)

    await pool.query(
        `UPDATE shops
        SET shop_name = $1, shop_slug = $2, qr_url = $3
        WHERE id = $4`,
        [shop_name, shop_slug, qr_url, id]
    )

    return {
        shop: {
            shop_name,
            shop_slug,
            qr_url
        }
    }
}

// get shop
// owner get shop by id and token
export const getShopService = async ({ user_id, id }) => {

    if(!id) throw new Error("Shop id is required")

    const result = await pool.query(
        `SELECT id, shop_name, shop_slug, qr_url
        FROM shops
        WHERE id = $1 AND user_id = $2
        AND is_deleted = false`,
        [id, user_id]
    );

    if (result.rows.length === 0) {
        throw new Error("Shop not found");
    }

    return {
        shop: result.rows[0]
    };

}


// delete shop
// soft delete
export const deleteShopService = async ({user_id, id, is_deleted, confirm_shop_name}) => {

    if(!id) throw new Error("Shop id is required")
    if (!confirm_shop_name) throw new Error("Shop name confirmation is required")

    const shopResult = await pool.query(
        `SELECT id, shop_name
        FROM shops
        WHERE id = $1
        AND user_id = $2
        AND is_deleted = false`,
        [id, user_id]
    )

    if (shopResult.rows.length === 0) {
        throw new Error("Shop not found or not authorized")
    }

    const shop = shopResult.rows[0]

    if (shop.shop_name !== confirm_shop_name) {
        throw new Error("Shop name confirmation does not match")
    }

    await pool.query(
        `UPDATE shops
        SET is_deleted = true
        WHERE id = $1`,
        [id]
    )

    return { success: true }

}


// public 

// get shop
export const getShopPublicService = async ({shop_slug}) => {

    if(!shop_slug) throw new Error ("Slug is required")

    const result = await pool.query(
        `SELECT shop_name from shops WHERE shop_slug =$1 AND is_deleted = false`,
        [shop_slug]
    )

    if (result.rows.length === 0) {
        throw new Error("Shop not found");
    }

    return {
        shop: result.rows[0]
    }

}

// admin 

// search shop by admin
export const searchShopAdminService = async ({role_id, search, page, limit, sort, order}) => {

    if(role_id !== 1) throw new Error ("Only admin can acess this service")

    const offset = (page - 1) * limit

    const allowedSort = ["created_at", "shop_name"]
    const allowedOrder = ["asc", "desc"]

    const sortField = allowedSort.includes(sort) ? sort : "created_at"
    const sortOrder = allowedOrder.includes(order.toLowerCase()) ? order : "desc"

    const result = await pool.query(
        `SELECT id, shop_name, shop_slug, qr_url, created_at
        FROM shops
        WHERE AND is_deleted = false
        AND shop_name ILIKE $1
        ORDER BY ${sortField} ${sortOrder}
        LIMIT $2 OFFSET $3`,
        [`%${search}%`, limit, offset]
    )

    const count = await pool.query(
        `SELECT COUNT(*) 
        FROM shops
        WHERE shop_name ILIKE $1`,
        [`%${search}%`]
    )

    const total = Number(count.rows[0].count)

    return {
        shops: result.rows,
        pagination: {
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit)
        }
    }
}

// get all shop
export const getAllShopAdminService = async ({role_id}) => {

    if(role_id !== 1) throw new Error ("Only admin can acess this service")
    
    const result = await pool.query(
        // `SELECT id, shop_name, shop_slug, qr_url
        // FROM shops
        // WHERE is_deleted = false 
        // ORDER BY id`,

        // versi advance
        `SELECT 
        shops.id,
        shops.shop_name,
        shops.shop_slug,
        shops.qr_url,
        users.name as owner_name,
        users.email
        FROM shops
        JOIN users ON users.id = shops.user_id
        WHERE shops.is_deleted = false
        ORDER BY shops.id`
    );

    result.rows.forEach(row => {
        if (!grouped[row.shopID]) {
            grouped[row.shopID] = {
                id: row.id,
                shop_name: row.shop_name,
            }
        }
    })

    return {
        shops: result.rows
    }

}

// get shop by id

export const getShopByShopIDAdminService = async ({role_id, id}) => {

    if(role_id !== 1) throw new Error ("Only admin can acess this service")

    if(!id) throw new Error("Shop id is required")

    const result = await pool.query(
        `SELECT id, shop_name, shop_slug, qr_url
        FROM shops
        WHERE id = $1
        AND is_deleted = false`,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Shop not found");
    }

    return {
        shop: result.rows[0]
    };
}