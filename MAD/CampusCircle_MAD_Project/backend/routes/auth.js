// -------------------------------------------------------------
// Auth routes — signup, login
// as plain text against the `password` column. In a real product
// you would bcrypt-hash them. Keeping it simple makes it trivial
// to explain in the viva and matches what the DBMS seed stores.
// -------------------------------------------------------------
const router = require('express').Router();
const pool   = require('../db');

// POST /api/auth/signup
// body: { name, email, password, phone_number, hostel_block }
router.post('/signup', async (req, res, next) => {
    try {
        const { name, email, password, phone_number, hostel_block } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'name, email, password are required' });
        }

        const [existing] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existing.length) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Auto-verify in the demo so new signups can list immediately.
        const [result] = await pool.query(
            `INSERT INTO users (name, email, password, phone_number, hostel_block, is_verified, verified_by)
             VALUES (?, ?, ?, ?, ?, 1, 1)`,
            [name, email, password, phone_number || null, hostel_block || null]
        );

        const [rows] = await pool.query(
            'SELECT user_id, name, email, hostel_block, is_verified FROM users WHERE user_id = ?',
            [result.insertId]
        );
        res.status(201).json({ user: rows[0] });
    } catch (e) { next(e); }
});

// POST /api/auth/login
// body: { email, password }
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }
        const [rows] = await pool.query(
            'SELECT user_id, name, email, password, hostel_block, is_verified FROM users WHERE email = ?',
            [email]
        );
        if (!rows.length || rows[0].password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const u = rows[0];
        delete u.password;           // never send the password back
        res.json({ user: u });
    } catch (e) { next(e); }
});

module.exports = router;
