const Cart = require('../models/Cart');
const Perfume = require('../models/Perfume');

const CartController = {
  addToCart: (req, res) => {
    const userId = req.session.user.userId;
    const perfumeId = req.params.id;
    const qtyInput = (req.body && req.body.quantity) || req.query.quantity || 1;
    const quantity = Math.max(1, parseInt(qtyInput, 10) || 1);

    Perfume.getPerfumeById(perfumeId, (perfumeErr, perfume) => {
      if (perfumeErr || !perfume) {
        req.flash('error', 'Unable to find that perfume.');
        return res.redirect('/shopping');
      }

      Cart.addOrIncrementItem(userId, perfumeId, quantity, (cartErr) => {
        if (cartErr) {
          req.flash('error', 'Could not add item to cart. Please try again.');
          return res.redirect('/shopping');
        }

        req.flash('success', `${perfume.perfumeName} added to your cart.`);
        return res.redirect('/cart');
      });
    });
  },

  viewCart: (req, res) => {
    const userId = req.session.user.userId;

    Cart.getCartByUser(userId, (err, items) => {
      if (err) {
        req.flash('error', 'Failed to load your cart.');
        return res.redirect('/shopping');
      }

      const cartItems = (items || []).map((item) => ({
        ...item,
        lineTotal: Number(item.price || 0) * Number(item.quantity || 0),
      }));

      const cartTotal = cartItems.reduce(
        (sum, item) => sum + Number(item.lineTotal || 0),
        0
      );

      return res.render('cart', { cartItems, cartTotal });
    });
  },

  updateCartItem: (req, res) => {
    const { cartId } = req.params;
    const quantity = parseInt(req.body.quantity, 10);

    if (!quantity || quantity < 1) {
      req.flash('error', 'Quantity must be at least 1.');
      return res.redirect('/cart');
    }

    Cart.updateQuantity(cartId, quantity, (err) => {
      if (err) {
        req.flash('error', 'Could not update quantity.');
      } else {
        req.flash('success', 'Cart updated.');
      }
      return res.redirect('/cart');
    });
  },

  removeCartItem: (req, res) => {
    const { cartId } = req.params;

    Cart.removeItem(cartId, (err) => {
      if (err) {
        req.flash('error', 'Could not remove item from cart.');
      } else {
        req.flash('success', 'Item removed from cart.');
      }
      return res.redirect('/cart');
    });
  },
};

module.exports = CartController;
