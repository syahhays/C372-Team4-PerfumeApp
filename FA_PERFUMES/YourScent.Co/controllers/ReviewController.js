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
  }
};

module.exports = ReviewController;
