const Wishlist = require('../models/Wishlist');

const WishlistController = {
  getWishlist: (req, res) => {
    if (!req.session.user) return res.redirect('/login');   // guard

    const userId = req.session.user.userId;

    Wishlist.getWishlistByUserId(userId, (err, items) => {
      if (err) {
        console.error(err);
        return res.send('Error loading wishlist');
      }
      res.render('wishlist', { items });
    });
  },

  addToWishlist: (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const userId = req.session.user.userId;
    const perfumeId = req.params.id;

    Wishlist.addToWishlist(userId, perfumeId, (err) => {
      if (err) console.error(err);
      res.redirect('/wishlist');
    });
  },

  removeFromWishlist: (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const userId = req.session.user.userId;
    const perfumeId = req.params.id;

    Wishlist.removeFromWishlist(userId, perfumeId, (err) => {
      if (err) console.error(err);
      res.redirect('/wishlist');
    });
  },

  moveToCart: (req, res) => {
    return res.send('Move to cart not implemented yet');
  }
};

module.exports = WishlistController;
