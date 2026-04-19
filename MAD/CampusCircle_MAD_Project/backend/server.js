// ==================================================================
// Campus Circle REST API (CSE3709 Mobile Application Development)
// Course: BMU CSE3709 — Mr. Gautam Gupta / Dr. Nikhil Kumar
// Team  : Saksham Lodha (240626), Gauri Pandey (240959),
//         Rishit Rebant (240608), Prerit Shrivastava (240593)
//
// Thin REST wrapper over the CSE2021 DBMS layer:
//   * Reads go through views
//   * Writes go through stored procedures (transactions, validations)
//   * Scalar analytics go through user-defined functions
// ==================================================================
const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Request logger (simple)
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check — used by the Android app's splash screen
app.get('/api/health', (_req, res) => res.json({ ok: true, message: 'campus_circle API is up' }));

// Mount routes
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/categories',   require('./routes/categories'));
app.use('/api/items',        require('./routes/items'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/reviews',      require('./routes/reviews'));
app.use('/api/users',        require('./routes/users'));

// Fallback 404
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, _req, res, _next) => {
    console.error('[error]', err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\nCampus Circle API running on port ${PORT}`);
    console.log(`  * Local      : http://127.0.0.1:${PORT}/api/health`);
    console.log(`  * Emulator   : http://10.0.2.2:${PORT}/api/health`);
    console.log(`  * LAN        : http://<your-laptop-ip>:${PORT}/api/health  (for real device)`);
});
