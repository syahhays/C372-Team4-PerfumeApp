const db = require('../db');

const Review = {
  addReview: (reviewData, callback) => {
    const { perfumeId, userId, rating, comment } = reviewData;
    const sql = 'INSERT INTO reviews (perfumeId, userId, rating, comment) VALUES (?, ?, ?, ?)';
    db.query(sql, [perfumeId, userId, rating, comment], callback);
  },

  getReviewsByPerfume: (perfumeId, callback) => {
    const sql = `SELECT r.reviewId, r.perfumeId, r.userId, r.rating, r.comment, r.created_at, u.username
                 FROM reviews r
                 JOIN users u ON r.userId = u.userId
                 WHERE r.perfumeId = ?
                 ORDER BY r.created_at DESC`;
    db.query(sql, [perfumeId], callback);
  },

  getReviewsByUser: (userId, callback) => {
    const sql = `SELECT r.reviewId, r.perfumeId, r.rating, r.comment, r.created_at, p.perfumeName, p.image
                 FROM reviews r
                 JOIN perfumes p ON r.perfumeId = p.perfumeId
                 WHERE r.userId = ?
                 ORDER BY r.created_at DESC`;
    db.query(sql, [userId], callback);
  }
  ,
  deleteReview: (reviewId, callback) => {
    const sql = 'DELETE FROM reviews WHERE reviewId = ?';
    db.query(sql, [reviewId], callback);
  }
};

module.exports = Review;
