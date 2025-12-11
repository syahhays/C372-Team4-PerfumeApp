// --------------------- SET UP ---------------------
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');

// Controllers
const PerfumeController = require('./controllers/PerfumeController');
const UserController = require('./controllers/UserController');
const VoucherController = require('./controllers/VoucherController');

// Middleware
const { checkAuthenticated, checkAuthorised } = require('./middleware');
const { render } = require('ejs');

const app = express();

// --------------------- MULTER (IMAGE UPLOAD) ---------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// --------------------- VIEW ENGINE + STATIC FILES ---------------------
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --------------------- SESSION + FLASH ---------------------
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 1 week
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// --------------------- HOME ---------------------
app.get('/', (req, res) => {
    res.render('homepage');
});

// --------------------- PRODUCT ROUTES ---------------------
app.get('/inventory', checkAuthenticated, checkAuthorised(['admin']), PerfumeController.getAllPerfumes);

// Add Perfume
app.get('/addPerfume', checkAuthenticated, checkAuthorised(['admin']), PerfumeController.renderAddPerfume);
app.post('/addPerfume', checkAuthenticated, checkAuthorised(['admin']), PerfumeController.addPerfume);

// Edit Perfume
app.get('/editPerfume/:id', checkAuthenticated, checkAuthorised(['admin']), PerfumeController.renderEditPerfume);
app.post('/editPerfume/:id', checkAuthenticated, checkAuthorised(['admin']), PerfumeController.updatePerfume);

// Delete Perfume
app.get('/deletePerfume/:id', checkAuthenticated, checkAuthorised(['admin']), PerfumeController.deletePerfume);
app.post('/perfumes/:id/delete', checkAuthenticated, checkAuthorised(['admin']), PerfumeController.deletePerfume);

// Shopping Page
app.get('/shopping', PerfumeController.getAllPerfumesShopping);

// View Perfume Details
app.get('/perfumes', PerfumeController.getAllPerfumes);
app.get('/perfume/:id', PerfumeController.getPerfumeById);

// --------------------- USER ROUTES ---------------------
app.get('/register', (req, res) => res.render('register'));
app.post('/register', UserController.registerUser);

app.get('/login', (req, res) => res.render('login'));
app.post('/login', UserController.loginUser);

app.get('/logout', UserController.logout);

// Profile + Edit Profile
app.get('/profile', checkAuthenticated, UserController.getUserProfile);
app.get('/editProfile', checkAuthenticated, UserController.getEditProfile);
app.post('/editProfile', checkAuthenticated, UserController.editUserProfile);

// --------------------- VOUCHER ROUTES  ---------------------
app.get('/vouchers', checkAuthenticated, checkAuthorised(['admin']), VoucherController.list);

app.get('/vouchers/add', checkAuthenticated, checkAuthorised(['admin']), VoucherController.showAddForm);
app.post('/vouchers/add', checkAuthenticated, checkAuthorised(['admin']), VoucherController.add);

app.get('/vouchers/edit/:id', checkAuthenticated, checkAuthorised(['admin']), VoucherController.showEditForm);
app.post('/vouchers/edit/:id', checkAuthenticated, checkAuthorised(['admin']), VoucherController.update);

app.get('/vouchers/delete/:id', checkAuthenticated, checkAuthorised(['admin']), VoucherController.delete);

// --------------------- START SERVER ---------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});