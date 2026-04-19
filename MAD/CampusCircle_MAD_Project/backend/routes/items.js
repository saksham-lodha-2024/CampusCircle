// -------------------------------------------------------------
// Items routes
//   GET  /api/items                    → v_active_listings (home feed)
//   GET  /api/items/:id                → full item detail + seller
//   POST /api/items                    → sp_list_new_item (seller posts)
// -------------------------------------------------------------
const router = require('express').Router();
const pool   = require('../db');

// -------- GET /api/items?category=Electronics --------
router.get('/', async (req, res, next) => {
    try {
        const { category } = req.query;
        let sql  = 'SELECT * FROM v_active_listings';
        let args = [];
        if (category) {
            sql  += ' WHERE category_name = ?';
            args = [category];
        }
        sql += ' ORDER BY listed_on DESC';
        const [rows] = await pool.query(sql, args);
        res.json(rows);
    } catch (e) { next(e); }
});

// -------- GET /api/items/:id --------
router.get('/:id', async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT  i.item_id, i.title, i.price, i.rent_price_per_day, i.item_type,
                     i.availability_status, i.created_at,
                     c.category_id, c.category_name,
                     u.user_id AS seller_id, u.name AS seller_name,
                     u.hostel_block, u.is_verified
             FROM    items i
             JOIN    users      u ON u.user_id     = i.seller_id
             JOIN    categories c ON c.category_id = i.category_id
             WHERE   i.item_id = ?`,
            [req.params.id]
        );
        if (!rows.length) return res.status(404).json({ error: 'Item not found' });
        res.json(rows[0]);
    } catch (e) { next(e); }
});

// -------- POST /api/items --------
// body: { seller_id, category_id, title, item_type, price, rent_price_per_day }
router.post('/', async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        const { seller_id, category_id, title, item_type, price, rent_price_per_day } = req.body;
        if (!seller_id || !category_id || !title || !item_type) {
            return res.status(400).json({ error: 'seller_id, category_id, title, item_type are required' });
        }

        // sp_list_new_item(IN seller, IN cat, IN title, IN type, IN price, IN rent, OUT item_id)
        await conn.query(
            'CALL sp_list_new_item(?, ?, ?, ?, ?, ?, @out_id)',
            [seller_id, category_id, title, item_type, price || null, rent_price_per_day || null]
        );
        const [rows] = await conn.query('SELECT @out_id AS new_item_id');
        res.status(201).json({ item_id: rows[0].new_item_id });
    } catch (e) {
        // MySQL SIGNAL errors come through as sqlMessage
        if (e.sqlMessage) return res.status(400).json({ error: e.sqlMessage });
        next(e);
    } finally {
        conn.release();
    }
});

// -------- GET /api/items/seller/:user_id  (My Listings screen) --------
router.get('/seller/:user_id', async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT i.item_id, i.title, i.item_type, i.price, i.rent_price_per_day,
                    i.availability_status, c.category_name, i.created_at
             FROM   items i
             JOIN   categories c ON c.category_id = i.category_id
             WHERE  i.seller_id = ?
             ORDER  BY i.created_at DESC`,
            [req.params.user_id]
        );
        res.json(rows);
    } catch (e) { next(e); }
});

module.exports = router;
