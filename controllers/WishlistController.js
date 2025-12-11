const Wishlist = require('../models/Wishlist');

const WishlistController = {
  getWishlist: (req, res) => {
    const userId = req.session.user.id;

    Wishlist.getWishlistByUserId(userId, (err, items) => {
      if (err) {
        console.error(err);
        return res.send('Error loading wishlist');
      }
      res.render('wishlist', { items, user: req.session.user });
    });
  },

  addToWishlist: (req, res) => {
    const userId = req.session.user.id;
    const perfumeId = req.params.id;

    Wishlist.addToWishlist(userId, perfumeId, (err) => {
      if (err) console.error(err);
      res.redirect('/wishlist');
    });
  },

  removeFromWishlist: (req, res) => {
    const userId =  req.session.user.id;
    const perfumeId = req.params.id;

    Wishlist.removeFromWishlist(userId, perfumeId, (err) => {
      if (err) console.error(err);
      res.redirect('/wishlist');
    });
  },

  moveToCart: (req, res) => {
//     const userId = req.session.user.id;
//     const perfumeId = req.params.id;

//     Cart.addOrIncreaseCartItem(userId, perfumeId, (err) => {
//       if (err) console.error(err);
//       Wishlist.removeFromWishlist(userId, perfumeId, () => {
//         res.redirect('/cart');
//       });
//     });
//   }
// }; //will add in after cart is done
  return res.send('Move to cart not implemented yet');
  }
};

module.exports = WishlistController;
