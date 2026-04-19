// -------------------------------------------------------------
// Transactions routes — wraps sp_create_transaction + sp_complete_transaction
//   POST  /api/transactions                     → buyer requests
//   GET   /api/transactions/buyer/:user_id      → buyer's requests
//   GET   /api/transactions/seller/:user_id     → seller dashboard
//   PUT   /api/transactions/:id/status          → approve / reject / cancel
//   PUT   /api/transactions/:id/complete        → sp_complete_transaction
// -------------------------------------------------------------
const router = require('express').Router();
const pool   = require('../db');

// POST /api/transactions
// body: { item_id, buyer_id, start_date?, end_date? }
router.post('/', async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        const { item_id, buyer_id, start_date, end_date } = req.body;
        if (!item_id || !buyer_id) {
            return res.status(400).json({ error: 'item_id and buyer_id are required' });
        }
        await conn.query(
            'CALL sp_create_transaction(?, ?, ?, ?, @out_id)',
            [item_id, buyer_id, start_date || null, end_date || null]
        );
        const [rows] = await conn.query('SELECT @out_id AS new_trx_id');
        res.status(201).json({ transaction_id: rows[0].new_trx_id });
    } catch (e) {
        if (e.sqlMessage) return res.status(400).json({ error: e.sqlMessage });
        next(e);
    } finally {
        conn.release();
    }
});

// GET /api/transactions/buyer/:user_id
router.get('/buyer/:user_id', async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT  t.transaction_id, t.status, t.payment_status, t.total_amount,
                     t.transaction_type, t.start_date, t.end_date, t.created_at,
                     i.item_id, i.title,
                     u.user_id AS seller_id, u.name AS seller_name, u.hostel_block AS seller_hostel
             FROM    transactions t
             JOIN    items  i ON i.item_id  = t.item_id
             JOIN    users  u ON u.user_id  = t.seller_id
             WHERE   t.buyer_id = ?
             ORDER   BY t.created_at DESC`,
            [req.params.user_id]
        );
        res.json(rows);
    } catch (e) { next(e); }
});

// GET /api/transactions/seller/:user_id
router.get('/seller/:user_id', async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT  t.transaction_id, t.status, t.payment_status, t.total_amount,
                     t.transaction_type, t.start_date, t.end_date, t.created_at,
                     i.item_id, i.title,
                     u.user_id AS buyer_id, u.name AS buyer_name, u.hostel_block AS buyer_hostel
             FROM    transactions t
             JOIN    items  i ON i.item_id  = t.item_id
             JOIN    users  u ON u.user_id  = t.buyer_id
             WHERE   t.seller_id = ?
             ORDER   BY t.created_at DESC`,
            [req.params.user_id]
        );
        res.json(rows);
    } catch (e) { next(e); }
});

// PUT /api/transactions/:id/status
// body: { status }   -- one of 'approved','rejected','active','cancelled'
router.put('/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowed = ['approved', 'rejected', 'active', 'cancelled'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ error: 'status must be one of ' + allowed.join(', ') });
        }
        const [result] = await pool.query(
            'UPDATE transactions SET status = ? WHERE transaction_id = ?',
            [status, req.params.id]
        );
        if (!result.affectedRows) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ transaction_id: Number(req.params.id), status });
    } catch (e) { next(e); }
});

// PUT /api/transactions/:id/complete   -- calls sp_complete_transaction
router.put('/:id/complete', async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('CALL sp_complete_transaction(?)', [req.params.id]);
        res.json({ transaction_id: Number(req.params.id), status: 'completed' });
    } catch (e) {
        if (e.sqlMessage) return res.status(400).json({ error: e.sqlMessage });
        next(e);
    } finally {
        conn.release();
    }
});

// GET /api/transactions/:id   -- details for handover/review screen
router.get('/:id', async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT  t.*,
                     i.title AS item_title,
                     bu.name AS buyer_name,
                     se.name AS seller_name
             FROM    transactions t
             JOIN    items i ON i.item_id   = t.item_id
             JOIN    users bu ON bu.user_id = t.buyer_id
             JOIN    users se ON se.user_id = t.seller_id
             WHERE   t.transaction_id = ?`,
            [req.params.id]
        );
        if (!rows.length) return res.status(404).json({ error: 'Transaction not found' });
        res.json(rows[0]);
    } catch (e) { next(e); }
});

module.exports = router;
