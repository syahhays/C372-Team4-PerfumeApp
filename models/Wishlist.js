// models/Wishlist.js
const db = require('../db');
exports.getWishlistByUserId = (userId, callback) => {
  const sql = `
    SELECT w.id AS wishlistId,
    p.perfumeId, p.perfumeName, p.price, p.image
    FROM wishlist w
    JOIN perfumes p ON w.perfumeId = p.perfumeId
    WHERE w.userId = ?
  `;
  db.query(sql, [userId], callback);
};

exports.addToWishlist = (userId, perfumeId, callback) => {
  const sql = 'INSERT IGNORE INTO wishlist (userId, perfumeId) VALUES (?, ?)';
  db.query(sql, [userId, perfumeId], callback);
};

exports.removeFromWishlist = (userId, perfumeId, callback) => {
  const sql = 'DELETE FROM wishlist WHERE userId = ? AND perfumeId = ?';
  db.query(sql, [userId, perfumeId], callback);
};
