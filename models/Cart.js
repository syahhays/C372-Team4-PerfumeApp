const db = require('../db');

const Cart = {
  getCartByUser: (userId, callback) => {
    const sql = `
      SELECT 
        c.cartId,
        c.userId,
        c.perfumeId,
        c.quantity,
        p.perfumeName,
        p.price,
        p.image,
        p.perfumeDescription
      FROM cart c
      JOIN perfumes p ON c.perfumeId = p.perfumeId
      WHERE c.userId = ?`;
    db.query(sql, [userId], callback);
  },

  addOrIncrementItem: (userId, perfumeId, quantity, callback) => {
    const findSql = 'SELECT cartId, quantity FROM cart WHERE userId = ? AND perfumeId = ?';
    db.query(findSql, [userId, perfumeId], (findErr, rows) => {
      if (findErr) return callback(findErr);

      if (rows && rows.length > 0) {
        const currentQty = rows[0].quantity || 0;
        const updateSql = 'UPDATE cart SET quantity = ? WHERE cartId = ?';
        return db.query(updateSql, [currentQty + quantity, rows[0].cartId], callback);
      }

      const insertSql = 'INSERT INTO cart (userId, perfumeId, quantity) VALUES (?, ?, ?)';
      return db.query(insertSql, [userId, perfumeId, quantity], callback);
    });
  },

  updateQuantity: (cartId, quantity, callback) => {
    const sql = 'UPDATE cart SET quantity = ? WHERE cartId = ?';
    db.query(sql, [quantity, cartId], callback);
  },

  removeItem: (cartId, callback) => {
    const sql = 'DELETE FROM cart WHERE cartId = ?';
    db.query(sql, [cartId], callback);
  },

  clearUserCart: (userId, callback) => {
    const sql = 'DELETE FROM cart WHERE userId = ?';
    db.query(sql, [userId], callback);
  },
};

module.exports = Cart;
