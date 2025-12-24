// --------------------- SET UP S---------------------
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const PerfumeController = require('./controllers/PerfumeController');
const UserController = require('./controllers/UserController');
const ReviewController = require('./controllers/ReviewController');
const VoucherController = require('./controllers/VoucherController');
const CartController = require('./controllers/CartController');
const WishlistController = require('./controllers/WishlistController');

//for login checks and admin role checks
const { checkAuthenticated, checkAuthorised } = require('./middleware');
const { render } = require('ejs');

const app = express();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Set up view engine
app.set('view engine', 'ejs');
// enable static files
app.use(express.static('public'));
// enable form processing
app.use(express.urlencoded({ extended: true })); // parse form POST bodies
app.use(express.json());

// Session & flash
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    // Session expires after 1 week of inactivity
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


// Make session user available in all views
app.use((req, res, next) => {
    res.locals.user = req.session && req.session.user ? req.session.user : null;
    // expose specific flash arrays so views can use `errors` or `success`
    res.locals.errors = req.flash('error') || [];
    res.locals.success = req.flash('success') || [];
    res.locals.messages = { error: res.locals.errors, success: res.locals.success };
    next();
});

// --------------------- Product Routes  ---------------------
// Home
app.get('/', (req, res) => {
    res.render('homepage');
});

// Inventory page (displays all products for admin - Edit, delete, add)
app.get('/inventory',checkAuthenticated,checkAuthorised(['admin','headAdmin']), PerfumeController.getAllPerfumes);

// Add new perfume
app.get('/addPerfume',checkAuthenticated,checkAuthorised(['admin','headAdmin']), PerfumeController.renderAddPerfume);
app.post('/addPerfume',checkAuthenticated,checkAuthorised(['admin','headAdmin']), PerfumeController.addPerfume);
// Update/Edit existing perfume
app.get('/editPerfume/:id',checkAuthenticated,checkAuthorised(['admin','headAdmin']), PerfumeController.renderEditPerfume);
app.post('/editPerfume/:id',checkAuthenticated,checkAuthorised(['admin','headAdmin']), PerfumeController.updatePerfume);

// Delete perfume
app.get('/deletePerfume/:id',checkAuthenticated,checkAuthorised(['admin','headAdmin']), PerfumeController.deletePerfume);
app.post('/perfumes/:id/delete',checkAuthenticated,checkAuthorised(['admin','headAdmin']), PerfumeController.deletePerfume);
// Shopping page (displays all products for customers)
app.get('/shopping', PerfumeController.getAllPerfumesShopping);

// View individual perfume details
app.get('/perfumes', PerfumeController.getAllPerfumes);
app.get('/perfume/:id', PerfumeController.getPerfumeById);
// --------------------- User Routes --------------------------
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', UserController.registerUser);

app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', UserController.loginUser);

app.get('/logout', UserController.logout);

// User Profile
app.get('/profile', checkAuthenticated, UserController.getUserProfile);

// Edit Profile
app.get('/editProfile', checkAuthenticated, UserController.getEditProfile);

app.post('/editProfile', checkAuthenticated, UserController.editUserProfile);

// --admin side--
app.get('/allUsers', checkAuthenticated, checkAuthorised(['admin','headAdmin']), UserController.getAll);

app.get('/banUser/:userId', checkAuthenticated, checkAuthorised(['admin','headAdmin']), UserController.banUser);

app.get('/unbanUser/:userId', checkAuthenticated, checkAuthorised(['admin','headAdmin']), UserController.unbanUser);

// --------------------- Cart Routes ------------------------
app.get('/cart', checkAuthenticated, CartController.viewCart);
app.get('/addtocart/:id', checkAuthenticated, CartController.addToCart);
app.post('/cart/add/:id', checkAuthenticated, CartController.addToCart);
app.post('/cart/update/:cartId', checkAuthenticated, CartController.updateCartItem);
app.post('/cart/remove/:cartId', checkAuthenticated, CartController.removeCartItem);

// --------------------- Review Routes --------------------------
// Routes added for reviews
// Submit a review for a perfume (logged in users only)
app.post('/perfume/:id/review', checkAuthenticated, ReviewController.addReview);

// View all reviews created by the current user
app.get('/myreviews', checkAuthenticated, ReviewController.getUserReviews);

// Admin-only: delete a review
app.post('/review/:id/delete', checkAuthenticated, checkAuthorised(['admin','headAdmin']), ReviewController.deleteReview);

// --------------------- VOUCHER ROUTES  ---------------------
app.get('/vouchers', checkAuthenticated, checkAuthorised(['admin','headAdmin']), VoucherController.list);

app.get('/vouchers/add', checkAuthenticated, checkAuthorised(['admin','headAdmin']), VoucherController.showAddForm);
app.post('/vouchers/add', checkAuthenticated, checkAuthorised(['admin','headAdmin']), VoucherController.add);

app.get('/vouchers/edit/:id', checkAuthenticated, checkAuthorised(['admin','headAdmin']), VoucherController.showEditForm);
app.post('/vouchers/edit/:id', checkAuthenticated, checkAuthorised(['admin','headAdmin']), VoucherController.update);

app.get('/vouchers/delete/:id', checkAuthenticated, checkAuthorised(['admin','headAdmin']), VoucherController.delete);

// --------------------- Wishlist Routes --------------------------
app.get('/wishlist',checkAuthenticated, WishlistController.getWishlist);

app.post('/wishlist/add/:id',checkAuthenticated, WishlistController.addToWishlist);

app.post('/wishlist/remove/:id',checkAuthenticated, WishlistController.removeFromWishlist);

app.post('/wishlist/move-to-cart/:id',checkAuthenticated, WishlistController.moveToCart);

// --------------------- Start the server ---------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
