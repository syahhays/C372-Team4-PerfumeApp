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
  },

  deleteReview: (reviewId, callback) => {
    const sql = 'DELETE FROM reviews WHERE reviewId = ?';
    db.query(sql, [reviewId], callback);
  }
};

module.exports = Review;

//AMENDMENT
const db = require('../db');

const Review = {
  addReview: (reviewData, callback) => {
    const { perfumeId, userId, rating, comment } = reviewData;
    const sql = 'INSERT INTO reviews (perfumeId, userId, rating, comment) VALUES (?, ?, ?, ?)';
    db.query(sql, [perfumeId, userId, rating, comment], callback);
  },

  hasUserReviewed: (userId, perfumeId, callback) => {
    const sql = 'SELECT COUNT(*) AS cnt FROM reviews WHERE userId = ? AND perfumeId = ?';
    db.query(sql, [userId, perfumeId], (err, results) => {
      if (err) return callback(err);
      const cnt = (results && results[0] && results[0].cnt) ? results[0].cnt : 0;
      callback(null, cnt > 0);
    });
  },

  getReviewsByPerfume: (perfumeId, forAdmin, callback) => {
    // support calling signature getReviewsByPerfume(perfumeId, callback)
    if (typeof forAdmin === 'function') {
      callback = forAdmin;
      forAdmin = false;
    }
    const baseWithHidden = `SELECT r.reviewId, r.perfumeId, r.userId, r.rating, r.comment, r.created_at, r.hidden, u.username
                  FROM reviews r
                  JOIN users u ON r.userId = u.userId
                  WHERE r.perfumeId = ?`;
    const sqlWithHidden = forAdmin ? `${baseWithHidden} ORDER BY r.created_at DESC` : `${baseWithHidden} AND (r.hidden IS NULL OR r.hidden = 0) ORDER BY r.created_at DESC`;

    db.query(sqlWithHidden, [perfumeId], (err, results) => {
      if (!err) return callback(null, results);
      // If hidden column doesn't exist, fall back to legacy query without hidden
      if (err && err.code === 'ER_BAD_FIELD_ERROR' && /hidden/.test(err.message)) {
        const baseLegacy = `SELECT r.reviewId, r.perfumeId, r.userId, r.rating, r.comment, r.created_at, u.username
                  FROM reviews r
                  JOIN users u ON r.userId = u.userId
                  WHERE r.perfumeId = ? ORDER BY r.created_at DESC`;
        return db.query(baseLegacy, [perfumeId], callback);
      }
      return callback(err);
    });
  },

  getAllReviews: (callback) => {
    const sqlWithHidden = `SELECT r.reviewId, r.perfumeId, r.userId, r.rating, r.comment, r.created_at, r.hidden, u.username, p.perfumeName
                 FROM reviews r
                 JOIN users u ON r.userId = u.userId
                 JOIN perfumes p ON r.perfumeId = p.perfumeId
                 ORDER BY r.created_at DESC`;
    db.query(sqlWithHidden, [], (err, results) => {
      if (!err) return callback(null, results);
      if (err && err.code === 'ER_BAD_FIELD_ERROR' && /hidden/.test(err.message)) {
        const legacy = `SELECT r.reviewId, r.perfumeId, r.userId, r.rating, r.comment, r.created_at, u.username, p.perfumeName
                 FROM reviews r
                 JOIN users u ON r.userId = u.userId
                 JOIN perfumes p ON r.perfumeId = p.perfumeId
                 ORDER BY r.created_at DESC`;
        return db.query(legacy, [], callback);
      }
      return callback(err);
    });
  },

  getReviewsByUser: (userId, callback) => {
    const sqlWithHidden = `SELECT r.reviewId, r.perfumeId, r.rating, r.comment, r.created_at, r.hidden, p.perfumeName, p.image
                 FROM reviews r
                 JOIN perfumes p ON r.perfumeId = p.perfumeId
                 WHERE r.userId = ?
                 ORDER BY r.created_at DESC`;
    db.query(sqlWithHidden, [userId], (err, results) => {
      if (!err) return callback(null, results);
      if (err && err.code === 'ER_BAD_FIELD_ERROR' && /hidden/.test(err.message)) {
        const legacy = `SELECT r.reviewId, r.perfumeId, r.rating, r.comment, r.created_at, p.perfumeName, p.image
                 FROM reviews r
                 JOIN perfumes p ON r.perfumeId = p.perfumeId
                 WHERE r.userId = ?
                 ORDER BY r.created_at DESC`;
        return db.query(legacy, [userId], callback);
      }
      return callback(err);
    });
  },

  toggleHidden: (reviewId, hidden, callback) => {
    const sql = 'UPDATE reviews SET hidden = ? WHERE reviewId = ?';
    db.query(sql, [hidden ? 1 : 0, reviewId], callback);
  },

  deleteReview: (reviewId, callback) => {
    const sql = 'DELETE FROM reviews WHERE reviewId = ?';
    db.query(sql, [reviewId], callback);
  }
};

module.exports = Review;