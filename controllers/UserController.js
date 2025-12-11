const User = require('../models/User');
const UserController = {
    //--user side--
    //registers a new user
    registerUser: (req, res) => {
        const userDetails = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            contact: req.body.contact
        };
        User.addUser(userDetails, (err, results) => {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/register');
            }
            req.flash('success', 'Registration successful! Please log in.');
            res.redirect('/login');
        });
    },
    //logs in a user
    loginUser: (req, res) => {
        const { username, password } = req.body;
        User.loginUser(username, password, (err, result) => {
            if (err) {
                req.flash('error', err.message || err);
                return res.redirect('/login');
            }
            if (!result) {
                req.flash('error', 'Invalid username or password');
                return res.redirect('/login');
            }
            if (result.banned === 1) {
                req.flash('error', 'Your account has been banned. please contact support for more information.');
                return res.redirect('/login');
            }
            req.session.user = {
                userId: result.userId,
                name: result.username,
                email: result.email,
                contact: result.contact,
                role: result.role,
            }
            req.flash('success', 'Login successful!');
            if (result.role === 'admin') {
                return res.redirect('/inventory');
            } else {
                return res.redirect('/');
            }
        });
    },
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                req.flash('error', 'Error logging out. Please try again.');
                return res.redirect('/');
            }
            return res.redirect('/login');
        });
    },

    getUserProfile(req, res) {
        const userId = req.session.user.userId;
        User.getbyId(userId, (err, user) => {
            if (err) {
                req.flash('error', 'Error fetching user profile.');
                return res.redirect('/');
            }
            res.render('profile', { user });
        });
    },

    getEditProfile(req, res) {
        const userId = req.session.user.userId;
        User.getbyId(userId, (err, user) => {
            if (err) {
                req.flash('error', 'Error fetching user profile.');
                return res.redirect('/');
            }
            res.render('editProfile', { user });
        });
    },

    editUserProfile(req, res) {
        const userId = req.session.user.userId;
        const updatedDetails = {
            email: req.body.email,
            contact: req.body.contact,
            password: req.body.password,
        };
        User.updateProfile(userId, updatedDetails, (err, result) => {
            if (err) {
                req.flash('error', 'Error updating profile.');
                return res.redirect('/profile');
            }
            req.flash('success', 'Profile updated successfully!');
            res.redirect('/profile');
        });
    },

    //--admin side--
};

module.exports = UserController;