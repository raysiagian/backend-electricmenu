import pool from '../config/db.js'
import { orderNotificationEmail } from '../utils/order-notification-email.js';

// Public
export const createOrderService = async ({ shop_slug, buyer_name, items }) => {
    if (!shop_slug || !buyer_name || !items || items.length === 0) {
        throw new Error("shop_slug, buyer_name, and items are required");
    }

    // Ambil shop
    const shopResult = await pool.query(
        `SELECT id, shop_name FROM shops WHERE shop_slug = $1 AND is_deleted = false`,
        [shop_slug]
    );
    if (shopResult.rows.length === 0) throw new Error("Shop not found");

    const shop_id = shopResult.rows[0].id;
    const shop_name = shopResult.rows[0].shop_name;

    let grand_total = 0;
    const validatedItems = [];

    // Validasi setiap item
    for (const item of items) {
        const { product_id, quantity } = item;

        if (!product_id || !quantity || quantity < 1) {
            throw new Error("Each item must have product_id and quantity (min 1)");
        }

        const productResult = await pool.query(
            `SELECT id, shop_id, product_name, price, stock, service_type, is_available, is_deleted
            FROM products 
            WHERE id = $1 AND shop_id = $2`,
            [product_id, shop_id]
        );

        if (productResult.rows.length === 0) {
            throw new Error(`Product ${product_id} not found`);
        }

        const product = productResult.rows[0];

        if (product.is_deleted) throw new Error(`Product ${product_id} is no longer available`);
        if (!product.is_available) throw new Error(`Product ${product_id} is currently unavailable`);

        if (product.service_type === "product") {
            if (product.stock < quantity) {
                throw new Error(`Insufficient stock for product ${product_id}. Available: ${product.stock}`);
            }
        }

        const total_price = product.price * quantity;
        grand_total += Number(total_price);
        validatedItems.push({ product, quantity, total_price });
    }

    // Buat order header
    const orderResult = await pool.query(
        `INSERT INTO orders (shop_id, buyer_name, grand_total)
        VALUES ($1, $2, $3)
         RETURNING *`,
        [shop_id, buyer_name, grand_total]
    );
    const order = orderResult.rows[0];

    // Buat order items + kurangi stock
    for (const { product, quantity, total_price } of validatedItems) {
        await pool.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price, total_price)
            VALUES ($1, $2, $3, $4, $5)`,
            [order.id, product.id, quantity, product.price, total_price]
        );

        if (product.service_type === "product") {
            await pool.query(
                `UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2`,
                [quantity, product.id]
            );
        }
    }

    // Ambil email owner
    const userResult = await pool.query(
        `SELECT u.email 
        FROM users u
        JOIN shops s ON s.user_id = u.id
        WHERE s.id = $1`,
        [shop_id]
    );

    if (userResult.rows.length === 0) throw new Error("Owner not found");
    const owner_email = userResult.rows[0].email;

    // Kirim email notifikasi
    await orderNotificationEmail({
        ownerEmail: owner_email,
        shopName: shop_name,
        buyerName: buyer_name,
        items: validatedItems.map(i => ({
            product_name: i.product.product_name,
            quantity: i.quantity,
            total_price: i.total_price
        })),
        grandTotal: grand_total
    });

    return {
        ...order,
        items: validatedItems.map(i => ({
            product_id: i.product.id,
            quantity: i.quantity,
            total_price: i.total_price
        }))
    };
};

// User

export const getOrdersByShopService = async ({ 
    user_id, 
    shop_id,
    page = 1, 
    limit = 10, 
    sort, 
    order,
    status
}) => {

    // console.log(`${shop_id} and ${user_id}`)

    if (!shop_id || !user_id) throw new Error("All field required");

    const offset = (page - 1) * limit;

    const allowedSort = ["id", "grand_total", "status", "created_at"];
    const allowedOrder = ["ASC", "DESC"];
    const safeSort = allowedSort.includes(sort) ? sort : "id";
    const safeOrder = allowedOrder.includes(order.toUpperCase()) ? order.toUpperCase() : "DESC";


    const allowedStatus = ["pending", "cancelled", "done"];

    // Cek shop milik user
    const shopCheck = await pool.query(
        `SELECT id FROM shops WHERE id = $1 AND user_id = $2 AND is_deleted = false`,
        [shop_id, user_id]
    );
    if (shopCheck.rows.length === 0) {
        throw new Error("Shop not found or not authorized");
    }

    // Build kondisi WHERE dinamis
    const conditions = [`o.shop_id = $1`];
    const values = [shop_id];
    let index = 2;

    if (status && allowedStatus.includes(status)) {
        conditions.push(`o.status = $${index}`);
        values.push(status);
        index++;
    }

    const whereClause = conditions.join(" AND ");

    const result = await pool.query(
        `SELECT 
            o.id,
            o.buyer_name,
            o.grand_total,
            o.status,
            o.created_at,
            json_agg(
                json_build_object(
                    'product_name', p.product_name,
                    'product_image_url', p.product_image_url,
                    'price', oi.price,
                    'quantity', oi.quantity,
                    'total_price', oi.total_price
                )
            ) AS items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE ${whereClause}
        AND p.is_deleted = false
        GROUP BY o.id
        ORDER BY o.${safeSort} ${safeOrder}
        LIMIT $${index} OFFSET $${index + 1}`,
        [...values, limit, offset]
    );

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM orders o
        WHERE ${whereClause}`,
        values
    );

    const total = parseInt(countResult.rows[0].count);

    return {
        orders: result.rows,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
};

export const updateOrderStatusService = async ({ user_id, order_id, status }) => {
    const allowed = ["pending", "cancelled", "done"];
    if (!allowed.includes(status)) {
        throw new Error(`Status must be one of: ${allowed.join(", ")}`);
    }

    // Cek order milik shop yang dimiliki user
    const orderCheck = await pool.query(
        `SELECT o.id FROM orders o
        JOIN shops s ON o.shop_id = s.id
        WHERE o.id = $1 AND s.user_id = $2`,
        [order_id, user_id]
    );
    if (orderCheck.rows.length === 0) {
        throw new Error("Order not found or not authorized");
    }

    const result = await pool.query(
        `UPDATE orders SET status = $1, updated_at = NOW()
        WHERE id = $2
         RETURNING *`,
        [status, order_id]
    );

    const order = result.rows[0];

    // Kalau cancelled, kembalikan stock untuk product type
    if (status === "cancelled") {
        const items = await pool.query(
            `SELECT oi.quantity, oi.product_id, p.service_type
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = $1`,
            [order_id]
        );

        for (const item of items.rows) {
            if (item.service_type === "product") {
                await pool.query(
                    `UPDATE products SET stock = stock + $1, updated_at = NOW() WHERE id = $2`,
                    [item.quantity, item.product_id]
                );
            }
        }
    }

    return order;
};