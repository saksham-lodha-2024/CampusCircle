// -------------------------------------------------------------
// Users — profile (calls the scalar UDFs fn_user_avg_rating,
// fn_user_review_count, fn_user_total_earnings)
// -------------------------------------------------------------
const router = require('express').Router();
const pool   = require('../db');

// GET /api/users/:id  -- basic profile
router.get('/:id', async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            'SELECT user_id, name, email, hostel_block, is_verified, created_at FROM users WHERE user_id = ?',
            [req.params.id]
        );
        if (!rows.length) return res.status(404).json({ error: 'User not found' });
        res.json(rows[0]);
    } catch (e) { next(e); }
});

// GET /api/users/:id/profile  -- profile + reputation stats from UDFs
router.get('/:id/profile', async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT u.user_id, u.name, u.email, u.hostel_block, u.is_verified, u.created_at,
                    fn_user_avg_rating(u.user_id)     AS avg_rating,
                    fn_user_review_count(u.user_id)   AS review_count,
                    fn_user_total_earnings(u.user_id) AS total_earnings
             FROM   users u
             WHERE  u.user_id = ?`,
            [req.params.id]
        );
        if (!rows.length) return res.status(404).json({ error: 'User not found' });

        const [dashboard] = await pool.query(
            'SELECT * FROM v_seller_dashboard WHERE seller_id = ?',
            [req.params.id]
        );
        res.json({ ...rows[0], dashboard: dashboard[0] || null });
    } catch (e) { next(e); }
});

// GET /api/users/top-rated  (optional leaderboard)
router.get('/leaderboard/top', async (_req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM v_top_rated_users LIMIT 10');
        res.json(rows);
    } catch (e) { next(e); }
});

module.exports = router;
