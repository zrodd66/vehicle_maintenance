const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  // First connection to create database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  });

  try {
    // Read schema file
    const schema = await fs.readFile(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .filter(statement => statement.trim());

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
        console.log('Executed:', statement.trim().split('\n')[0]);
      }
    }

    // Create admin user if it doesn't exist
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(`
      INSERT INTO vehicle_maintenance_db.users (name, email, password, role)
      VALUES ('Admin', 'admin@example.com', ?, 'admin')
      ON DUPLICATE KEY UPDATE
      password = VALUES(password)
    `, [hashedPassword]);

    console.log('Database initialized successfully!');
    console.log('Admin user created/updated with:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await connection.end();
  }
}

initializeDatabase();
