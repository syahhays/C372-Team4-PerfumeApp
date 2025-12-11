// --- Added lines for reviews feature ---
// Require the Review controller
const ReviewController = require('./controllers/ReviewController');

// Make session user available in all views (added)
app.use((req, res, next) => {
    res.locals.user = req.session && req.session.user ? req.session.user : null;
    // expose specific flash arrays so views can use `errors` or `success`
    res.locals.errors = req.flash('error') || [];
    res.locals.success = req.flash('success') || [];
    res.locals.messages = { error: res.locals.errors, success: res.locals.success };
    next();
});

// Routes added for reviews
// Submit a review for a perfume (logged in users only)
app.post('/perfume/:id/review', checkAuthenticated, ReviewController.addReview);

// View all reviews created by the current user
app.get('/myreviews', checkAuthenticated, ReviewController.getUserReviews);

// Admin-only: delete a review
app.post('/review/:id/delete', checkAuthenticated, checkAuthorised(['admin']), ReviewController.deleteReview);
