const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');
const WishlistController = {
  getWishlist: (req, res) => {
    if (!req.session.user) return res.redirect('/login');   // guard

    const userId = req.session.user.userId;

    Wishlist.getWishlistByUserId(userId, (err, items) => {
      if (err) {
        console.error(err);
        return res.send('Error loading wishlist');
      }
      const shareUrl = `${req.protocol}://${req.get('host')}/wishlist`;
      res.render('wishlist', { items, shareUrl });
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
    if (!req.session.user) return res.redirect('/login');

     const userId = req.session.user.userId;   // fixed here
     const perfumeId = req.params.id;

     Cart.addOrIncrementItem(userId, perfumeId, 1, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error moving item to cart');
      }

      Wishlist.removeFromWishlist(userId, perfumeId, () => {
        return res.redirect('/cart');
      });
    });
  } 
};

module.exports = WishlistController;