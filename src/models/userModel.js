const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(userData) {
    try {
      const { name, email, password, role } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role || 'user']
      );

      return {
        id: result.insertId,
        name,
        email,
        role
      };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userData) {
    try {
      const { name, email, role } = userData;
      let updates = [];
      let values = [];

      if (name) {
        updates.push('name = ?');
        values.push(name);
      }
      if (email) {
        updates.push('email = ?');
        values.push(email);
      }
      if (role) {
        updates.push('role = ?');
        values.push(role);
      }

      if (updates.length === 0) return null;

      values.push(id);
      const [result] = await pool.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
  }
}

module.exports = UserModel;
