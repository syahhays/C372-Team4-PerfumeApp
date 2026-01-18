const Review = require('../models/Review');

const ReviewController = {
  addReview: (req, res) => {
    const perfumeId = req.params.id;
    const userId = req.session.user.userId;
    const rating = parseInt(req.body.rating, 10) || 0;
    const comment = req.body.comment || null;

    const reviewData = { perfumeId, userId, rating, comment };
    Review.addReview(reviewData, (err) => {
      if (err) {
        req.flash('error', 'Failed to add review.');
        return res.redirect(`/perfume/${perfumeId}`);
      }
      req.flash('success', 'Review submitted.');
      res.redirect(`/perfume/${perfumeId}`);
    });
  },

  getUserReviews: (req, res) => {
    const userId = req.session.user.userId;
    Review.getReviewsByUser(userId, (err, reviews) => {
      if (err) {
        req.flash('error', 'Failed to load your reviews.');
        return res.redirect('/');
      }
      res.render('myReviews', { reviews });
    });
  },

  deleteReview: (req, res) => {
    const reviewId = req.params.id;
    Review.deleteReview(reviewId, (err) => {
      if (err) {
        req.flash('error', 'Failed to delete review.');
        return res.redirect(req.get('referer') || '/');
      }
      req.flash('success', 'Review deleted.');
      return res.redirect(req.get('referer') || '/');
    });
  }
};

module.exports = ReviewController;

//AMENDMENT
const Review = require('../models/Review');
const db = require('../db');

const ReviewController = {
  addReview: (req, res) => {
    const perfumeId = req.params.id;
    const userId = req.session.user.userId;
    const rating = parseInt(req.body.rating, 10) || 0;
    const comment = req.body.comment || null;

    // Prevent duplicate reviews
    Review.hasUserReviewed(userId, perfumeId, (err, hasReviewed) => {
      if (err) {
        req.flash('error', 'Failed to validate existing reviews.');
        return res.redirect(`/perfume/${perfumeId}`);
      }
      if (hasReviewed) {
        req.flash('error', 'You have already reviewed this product.');
        return res.redirect(`/perfume/${perfumeId}`);
      }

      // Check purchase history: try to query an orders table if it exists.
      const purchaseSql = `SELECT COUNT(*) AS cnt FROM orders o JOIN order_items oi ON oi.orderId = o.orderId WHERE o.userId = ? AND oi.perfumeId = ? AND o.status = 'completed'`;
      db.query(purchaseSql, [userId, perfumeId], (pErr, results) => {
        if (pErr) {
          // If orders table does not exist, allow review but warn in logs and flash
          if (pErr && pErr.code === 'ER_NO_SUCH_TABLE') {
            console.warn('Orders table missing; skipping purchase enforcement for reviews.');
            // proceed with adding the review
            const reviewData = { perfumeId, userId, rating, comment };
            return Review.addReview(reviewData, (addErr) => {
              if (addErr) {
                req.flash('error', 'Failed to add review.');
                return res.redirect(`/perfume/${perfumeId}`);
              }
              req.flash('success', 'Review submitted.');
              return res.redirect(`/perfume/${perfumeId}`);
            });
          }
          req.flash('error', 'Failed to verify purchase history.');
          return res.redirect(`/perfume/${perfumeId}`);
        }

        const cnt = (results && results[0] && results[0].cnt) ? results[0].cnt : 0;
        if (cnt === 0) {
          req.flash('error', 'You must purchase this product before leaving a review.');
          return res.redirect(`/perfume/${perfumeId}`);
        }

        // user has purchased -> allow review
        const reviewData = { perfumeId, userId, rating, comment };
        Review.addReview(reviewData, (addErr) => {
          if (addErr) {
            req.flash('error', 'Failed to add review.');
            return res.redirect(`/perfume/${perfumeId}`);
          }
          req.flash('success', 'Review submitted.');
          return res.redirect(`/perfume/${perfumeId}`);
        });
      });
    });
  },

  getUserReviews: (req, res) => {
    const userId = req.session.user.userId;
    Review.getReviewsByUser(userId, (err, reviews) => {
      if (err) {
        req.flash('error', 'Failed to load your reviews.');
        return res.redirect('/');
      }
      res.render('myReviews', { reviews });
    });
  },

  // Admin: list all reviews (including hidden)
  getAllReviewsForAdmin: (req, res) => {
    Review.getAllReviews((err, reviews) => {
      if (err) {
        req.flash('error', 'Failed to load reviews.');
        return res.redirect('/');
      }
      res.render('adminReviews', { reviews });
    });
  },

  // Admin action: toggle hidden flag
  toggleHide: (req, res) => {
    const reviewId = req.params.id;
    const hidden = req.body.hidden === '1' || req.body.hidden === 1 || req.body.hidden === true;
    Review.toggleHidden(reviewId, hidden, (err) => {
      if (!err) {
        req.flash('success', hidden ? 'Review hidden.' : 'Review visible.');
        return res.redirect(req.get('referer') || '/');
      }
      // If the `hidden` column doesn't exist, create it and retry once
      if (err && err.code === 'ER_BAD_FIELD_ERROR' && /hidden/.test(err.message)) {
        const db = require('../db');
        const alter = "ALTER TABLE reviews ADD COLUMN `hidden` TINYINT(1) DEFAULT 0 AFTER `comment`";
        return db.query(alter, (alterErr) => {
          if (alterErr) {
            req.flash('error', 'Failed to enable hide feature (DB migration failed).');
            return res.redirect(req.get('referer') || '/');
          }
          // retry toggle
          return Review.toggleHidden(reviewId, hidden, (retryErr) => {
            if (retryErr) {
              req.flash('error', 'Failed to update review visibility after migration.');
            } else {
              req.flash('success', hidden ? 'Review hidden.' : 'Review visible.');
            }
            return res.redirect(req.get('referer') || '/');
          });
        });
      }
      req.flash('error', 'Failed to update review visibility.');
      return res.redirect(req.get('referer') || '/');
    });
  },

  deleteReview: (req, res) => {
    const reviewId = req.params.id;
    Review.deleteReview(reviewId, (err) => {
      if (err) {
        req.flash('error', 'Failed to delete review.');
        return res.redirect(req.get('referer') || '/');
      }
      req.flash('success', 'Review deleted.');
      return res.redirect(req.get('referer') || '/');
    });
  },
};

module.exports = ReviewController;