const pool = require('../config/database');

class MaintenanceModel {
  static async findAll() {
    try {
      const [rows] = await pool.query(`
        SELECT m.*, 
               v.modelo as vehicle_model,
               v.placa as vehicle_plate,
               u.name as technician_name
        FROM maintenance m
        LEFT JOIN vehicles v ON m.vehicle_id = v.id
        LEFT JOIN users u ON m.technician_id = u.id
        ORDER BY m.date DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT m.*, 
               v.modelo as vehicle_model,
               v.placa as vehicle_plate,
               u.name as technician_name
        FROM maintenance m
        LEFT JOIN vehicles v ON m.vehicle_id = v.id
        LEFT JOIN users u ON m.technician_id = u.id
        WHERE m.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(maintenanceData) {
    try {
      const {
        vehicle_id,
        technician_id,
        type,
        description,
        cost,
        date,
        status
      } = maintenanceData;

      const [result] = await pool.query(
        `INSERT INTO maintenance (
          vehicle_id, technician_id, type, description,
          cost, date, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [vehicle_id, technician_id, type, description, cost, date, status]
      );

      return {
        id: result.insertId,
        ...maintenanceData
      };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, maintenanceData) {
    try {
      const updates = [];
      const values = [];

      Object.entries(maintenanceData).forEach(([key, value]) => {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      });

      if (updates.length === 0) return null;

      values.push(id);
      const [result] = await pool.query(
        `UPDATE maintenance SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM maintenance WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findByVehicleId(vehicleId) {
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

  static async findByTechnicianId(technicianId) {
    try {
      const [rows] = await pool.query(`
        SELECT m.*, 
               v.modelo as vehicle_model,
               v.placa as vehicle_plate
        FROM maintenance m
        LEFT JOIN vehicles v ON m.vehicle_id = v.id
        WHERE m.technician_id = ?
        ORDER BY m.date DESC
      `, [technicianId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getMaintenanceStats() {
    try {
      const [rows] = await pool.query(`
        SELECT 
          COUNT(*) as total_maintenance,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_maintenance,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_maintenance,
          SUM(cost) as total_cost
        FROM maintenance
      `);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MaintenanceModel;
