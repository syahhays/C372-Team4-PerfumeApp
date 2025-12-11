const Voucher = require('../models/Voucher');

module.exports = {
    list: (req, res) => {
        Voucher.getAll((err, results) => {
            if (err) return res.send(err);
            res.render('listVouchers', { vouchers: results });
        });
    },

    showAddForm: (req, res) => {
        res.render('addVoucher');
    },

    add: (req, res) => {
        const data = {
            code: req.body.code,
            description: req.body.description,
            discountType: req.body.discountType,
            discountValue: req.body.discountValue,
            expiryDate: req.body.expiryDate,
            usageLimit: req.body.usageLimit
        };

        Voucher.create(data, (err) => {
            if (err) return res.send(err);
            res.redirect('/vouchers');
        });
    },

    showEditForm: (req, res) => {
        const id = req.params.id;

        Voucher.getById(id, (err, results) => {
            if (err) return res.send(err);

            res.render('editVoucher', { voucher: results[0] });
        });
    },

    update: (req, res) => {
        const id = req.params.id;

        const data = {
            code: req.body.code,
            description: req.body.description,
            discountType: req.body.discountType,
            discountValue: req.body.discountValue,
            expiryDate: req.body.expiryDate,
            usageLimit: req.body.usageLimit
        };

        Voucher.update(id, data, (err) => {
            if (err) return res.send(err);
            res.redirect('/vouchers');
        });
    },

    delete: (req, res) => {
        const id = req.params.id;

        Voucher.delete(id, (err) => {
            if (err) return res.send(err);
            res.redirect('/vouchers');
        });
    }
};