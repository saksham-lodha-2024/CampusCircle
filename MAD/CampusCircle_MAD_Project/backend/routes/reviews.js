// -------------------------------------------------------------
// Reviews — wraps sp_submit_review + list by user
// -------------------------------------------------------------
const router = require('express').Router();
const pool   = require('../db');

// POST /api/reviews
// body: { transaction_id, reviewer_id, rating, comment }
router.post('/', async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        const { transaction_id, reviewer_id, rating, comment } = req.body;
        if (!transaction_id || !reviewer_id || !rating) {
            return res.status(400).json({ error: 'transaction_id, reviewer_id, rating are required' });
        }
        await conn.query(
            'CALL sp_submit_review(?, ?, ?, ?, @out_id)',
            [transaction_id, reviewer_id, rating, comment || null]
        );
        const [rows] = await conn.query('SELECT @out_id AS new_review_id');
        res.status(201).json({ review_id: rows[0].new_review_id });
    } catch (e) {
        if (e.sqlMessage) return res.status(400).json({ error: e.sqlMessage });
        next(e);
    } finally {
        conn.release();
    }
});

// GET /api/reviews/user/:id   -- reviews received by a user
router.get('/user/:id', async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT r.review_id, r.rating, r.comment, r.created_at,
                    u.user_id AS reviewer_id, u.name AS reviewer_name
             FROM   reviews r
             JOIN   users   u ON u.user_id = r.reviewer_id
             WHERE  r.review_for_user_id = ?
             ORDER  BY r.created_at DESC`,
            [req.params.id]
        );
        res.json(rows);
    } catch (e) { next(e); }
});

module.exports = router;
