-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS vehicle_maintenance_db;
USE vehicle_maintenance_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'technician') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    modelo VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    año INT NOT NULL,
    placa VARCHAR(20) UNIQUE NOT NULL,
    estado ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    usuario_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Maintenance table
CREATE TABLE IF NOT EXISTS maintenance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    technician_id INT,
    type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create initial admin user (password: admin123)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@example.com', '$2a$10$XgXB8p6VXdzRrKj0GZ9neuVYYKQM8mTF7QeqpK9qaW0j5oKNOBg6a', 'admin')
ON DUPLICATE KEY UPDATE id=id;
