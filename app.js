// --------------------- SET UP S---------------------
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const PerfumeController = require('./controllers/PerfumeController');

const WishlistController = require('./controllers/WishlistController');
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
//app.use(flash());


// Make session user available in all views
// app.use((req, res, next) => {
//     res.locals.user = req.session.user || null;
//     // expose specific flash arrays so views can use `errors` or `success`
//     res.locals.errors = req.flash('error') || [];
//     res.locals.success = req.flash('success') || [];
//     // keep a messages object for backwards compatibility
//     res.locals.messages = { error: res.locals.errors, success: res.locals.success };
//     next();
// });


// --------------------- Routes  ---------------------
// Home
app.get('/', (req, res) => {
    res.render('homepage');
});


// Inventory page (displays all products for admin - Edit, delete, add)
app.get('/inventory', PerfumeController.getAllPerfumes);


// Add new perfume
app.get('/addPerfume', PerfumeController.renderAddPerfume);
app.post('/addPerfume', PerfumeController.addPerfume);


// Update/Edit existing perfume
app.get('/editPerfume/:id', PerfumeController.renderEditPerfume);
app.post('/editPerfume/:id', PerfumeController.updatePerfume);


// Delete perfume
app.get('/deletePerfume/:id', PerfumeController.deletePerfume);
app.post('/perfumes/:id/delete', PerfumeController.deletePerfume);


// Shopping page (displays all products for customers)
app.get('/shopping', PerfumeController.getAllPerfumesShopping);


// View individual perfume details
app.get('/perfumes', PerfumeController.getAllPerfumes);
app.get('/perfume/:id', PerfumeController.getPerfumeById);

// --------------------- WISHLIST ---------------------
app.get('/wishlist', WishlistController.getWishlist);
app.post('/wishlist/add/:id', WishlistController.addToWishlist);
app.post('/wishlist/remove/:id', WishlistController.removeFromWishlist);
app.post('/wishlist/move-to-cart/:id', WishlistController.moveToCart);


// --------------------- Start the server ---------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});