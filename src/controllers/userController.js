const bcrypt = require('bcryptjs');
const pool = require('../models');

exports.createUser = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if username already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role || 'user']
    );

    res.status(201).json({
      id: result.insertId,
      username,
      role: role || 'user'
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, role, created_at FROM users'
    );
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query(
      'SELECT id, username, role, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;

    // Check if user exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If updating username, check if new username already exists
    if (username) {
      const [usernameCheck] = await pool.query(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, id]
      );

      if (usernameCheck.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    // Prepare update query
    let updateQuery = 'UPDATE users SET ';
    const updateValues = [];
    const updates = [];

    if (username) {
      updates.push('username = ?');
      updateValues.push(username);
    }

    if (password) {
      updates.push('password = ?');
      const hashedPassword = await bcrypt.hash(password, 10);
      updateValues.push(hashedPassword);
    }

    if (role) {
      updates.push('role = ?');
      updateValues.push(role);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    updateQuery += updates.join(', ');
    updateQuery += ' WHERE id = ?';
    updateValues.push(id);

    await pool.query(updateQuery, updateValues);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
