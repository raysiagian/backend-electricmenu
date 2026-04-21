
import { createOrderService, getOrdersByShopService, updateOrderStatusService } from "../services/order-service.js";

// Public
export const createOrder = async (req, res) => {
    try {
        const { shop_slug } = req.params;
        const { buyer_name, items } = req.body;

        // console.log("req.params:", req.params);
        // console.log("req.body:", req.body);

        const order = await createOrderService({ shop_slug, buyer_name, items });
        return res.status(200).json({ success: true, order });
    } catch (err) {
        console.error("createOrder error:", err.message);
        return res.status(400).json({ error: err.message });
    }
};


// User

export const getOrdersByShop = async (req, res) => {
    try {
        const { shop_id } = req.params;
        const user_id = req.user.sub;
        
        const {
            page = 1,
            limit = 10,
            sort = "id",
            order = "DESC",
            status
        } = req.query


        const result = await getOrdersByShopService({ 
            user_id, 
            shop_id,
            page: Number(page), 
            limit: Number(limit),
            sort,
            order,
            status

        });

        return res.status(200).json({ 
            orders: result.orders,
            pagination: result.pagination
        });

    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const user_id = req.user.sub;
        const { order_id } = req.params;
        const { status } = req.body;
        const order = await updateOrderStatusService({ user_id, order_id, status }); // ← tambah user_id
        return res.status(200).json({ success: true, order });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};