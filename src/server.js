require('./config/dotenvConfig');
const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 3000;

// Test database connection before starting server
async function startServer() {
  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('📦 Database connection successful');

    // Start the server
    app.listen(PORT, () => {
      console.log(`
🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
👉 http://localhost:${PORT}

Available endpoints:
- Authentication: /api/auth
  - POST /register
  - POST /login
  - GET /me
  - PUT /profile
  - PUT /change-password

- Vehicles: /api/vehicles
  - GET /
  - POST /
  - GET /:id
  - PUT /:id
  - DELETE /:id
  - GET /:id/maintenance
  - GET /stats

- Maintenance: /api/maintenance
  - GET /
  - POST /
  - GET /:id
  - PUT /:id
  - DELETE /:id
  - GET /stats

- System: /health
`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise rejection:', err);
  // Close server & exit process
  process.exit(1);
});

startServer();
