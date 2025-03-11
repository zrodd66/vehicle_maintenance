const pool = require('../config/database');

class VehicleModel {
  static async findAll() {
    try {
      const [rows] = await pool.query(`
        SELECT v.*, u.name as user_name 
        FROM vehicles v 
        LEFT JOIN users u ON v.usuario_id = u.id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT v.*, u.name as user_name 
        FROM vehicles v 
        LEFT JOIN users u ON v.usuario_id = u.id 
        WHERE v.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(vehicleData) {
    try {
      const { modelo, marca, año, placa, estado, usuario_id } = vehicleData;
      
      const [result] = await pool.query(
        'INSERT INTO vehicles (modelo, marca, año, placa, estado, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
        [modelo, marca, año, placa, estado, usuario_id]
      );

      return {
        id: result.insertId,
        ...vehicleData
      };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, vehicleData) {
    try {
      const updates = [];
      const values = [];

      Object.entries(vehicleData).forEach(([key, value]) => {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      });

      if (updates.length === 0) return null;

      values.push(id);
      const [result] = await pool.query(
        `UPDATE vehicles SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM vehicles WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM vehicles WHERE usuario_id = ?',
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getMaintenanceHistory(vehicleId) {
    try {
      const [rows] = await pool.query(`
        SELECT m.*, u.name as technician_name 
        FROM maintenance m 
        LEFT JOIN users u ON m.technician_id = u.id 
        WHERE m.vehicle_id = ? 
        ORDER BY m.date DESC
      `, [vehicleId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = VehicleModel;
