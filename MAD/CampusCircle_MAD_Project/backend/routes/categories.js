// -------------------------------------------------------------
// Categories — a read-only lookup list used by the post-item form
// -------------------------------------------------------------
const router = require('express').Router();
const pool   = require('../db');

// GET /api/categories
router.get('/', async (_req, res, next) => {
    try {
        const [rows] = await pool.query(
            'SELECT category_id, category_name FROM categories ORDER BY category_name'
        );
        res.json(rows);
    } catch (e) { next(e); }
});

module.exports = router;
