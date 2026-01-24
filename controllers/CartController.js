const Cart = require('../models/Cart');
const Perfume = require('../models/Perfume');
const Voucher = require('../models/Voucher');
const Rewards = require('../models/Rewards');

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

      // Get applied voucher from session or default to null
      const appliedVoucher = req.session.appliedVoucher || null;
      const rewardsDiscount = Number(req.session.rewardsDiscount || 0);
      const pointsRedeemed = Number(req.session.pointsRedeemed || 0);
      let discountAmount = 0;
      let subtotal = cartTotal;

      // Calculate discount if voucher is applied
      if (appliedVoucher) {
        if (appliedVoucher.discountType === 'percentage') {
          discountAmount = (cartTotal * appliedVoucher.discountValue) / 100;
        } else if (appliedVoucher.discountType === 'fixed') {
          discountAmount = appliedVoucher.discountValue;
        }
        // Ensure discount doesn't exceed total
        discountAmount = Math.min(discountAmount, cartTotal);
        subtotal = cartTotal - discountAmount;
      }

      let rewardsDiscountApplied = 0;
      if (rewardsDiscount > 0) {
        rewardsDiscountApplied = Math.min(rewardsDiscount, subtotal);
        subtotal -= rewardsDiscountApplied;
      }

      // Calculate GST (9% of subtotal)
      const GST_RATE = 0.09;
      const gst = subtotal * GST_RATE;

      // Get delivery option from session, default to 'standard'
      const deliveryOption = req.session.deliveryOption || 'standard';
      
      // Calculate shipping fee based on delivery option
      const STANDARD_SHIPPING = 15;
      const EXPRESS_SHIPPING = 30;
      const FREE_SHIPPING_THRESHOLD = 250;
      
      let shippingFee = 0;
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shippingFee = 0;
      } else {
        shippingFee = deliveryOption === 'express' ? EXPRESS_SHIPPING : STANDARD_SHIPPING;
      }

      const finalTotal = subtotal + gst + shippingFee;

      // Delivery info
      const deliveryInfo = {
        standard: { label: 'Standard Delivery', days: '3–5 working days' },
        express: { label: 'Express Delivery', days: '1–2 working days' }
      };

      Rewards.getPoints(userId, (pointsErr, points) => {
        const availablePoints = pointsErr ? 0 : points;

        return res.render('cart', { 
          cartItems, 
          cartTotal, 
          subtotal: Number(subtotal).toFixed(2), 
          gst: Number(gst).toFixed(2), 
          shippingFee: Number(shippingFee).toFixed(2), 
          appliedVoucher, 
          discountAmount: Number(discountAmount).toFixed(2), 
          rewardsDiscountApplied: Number(rewardsDiscountApplied).toFixed(2),
          pointsRedeemed,
          availablePoints,
          finalTotal: Number(finalTotal).toFixed(2),
          deliveryOption,
          deliveryInfo
        });
      });
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

  applyVoucher: (req, res) => {
    const voucherCode = (req.body.voucherCode || '').trim().toUpperCase();

    if (!voucherCode) {
      req.flash('error', 'Please enter a voucher code.');
      return res.redirect('/cart');
    }

    Voucher.getByCode(voucherCode, (err, results) => {
      if (err || !results || results.length === 0) {
        req.flash('error', 'Invalid voucher code.');
        return res.redirect('/cart');
      }

      const voucher = results[0];

      // Check if voucher has expired
      const currentDate = new Date();
      const expiryDate = new Date(voucher.expiryDate);
      if (currentDate > expiryDate) {
        req.flash('error', 'This voucher has expired.');
        return res.redirect('/cart');
      }

      // Check if usage limit has been reached
      if (voucher.usageCount >= voucher.usageLimit) {
        req.flash('error', 'This voucher has reached its usage limit.');
        return res.redirect('/cart');
      }

      // Store the applied voucher in session
      req.session.appliedVoucher = {
        voucherID: voucher.voucherID,
        code: voucher.code,
        description: voucher.description,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue
      };

      req.flash('success', `Voucher "${voucherCode}" applied successfully!`);
      return res.redirect('/cart');
    });
  },

  removeVoucher: (req, res) => {
    if (req.session.appliedVoucher) {
      delete req.session.appliedVoucher;
      req.flash('success', 'Voucher removed.');
    }
    return res.redirect('/cart');
  },

  updateDeliveryOption: (req, res) => {
    const deliveryOption = req.body.deliveryOption;

    if (deliveryOption === 'standard' || deliveryOption === 'express') {
      req.session.deliveryOption = deliveryOption;
    }

    return res.redirect('/cart');
  },
};

module.exports = CartController;