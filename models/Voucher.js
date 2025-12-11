const db = require('../db');

const Voucher = {
    create: (data, callback) => {
        const sql = `
            INSERT INTO vouchers 
            (code, description, discountType, discountValue, expiryDate, usageLimit, usageCount)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, [
            data.code,
            data.description,
            data.discountType,
            data.discountValue,
            data.expiryDate,
            data.usageLimit,
            0   // default usage count
        ], callback);
    },

    getAll: (callback) => {
        const sql = `SELECT * FROM vouchers`;
        db.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = `SELECT * FROM vouchers WHERE voucherID = ?`;
        db.query(sql, [id], callback);
    },

    update: (id, data, callback) => {
        const sql = `
            UPDATE vouchers SET
                code = ?,
                description = ?,
                discountType = ?,
                discountValue = ?,
                expiryDate = ?,
                usageLimit = ?
            WHERE voucherID = ?
        `;
        db.query(sql, [
            data.code,
            data.description,
            data.discountType,
            data.discountValue,
            data.expiryDate,
            data.usageLimit,
            id
        ], callback);
    },

    delete: (id, callback) => {
        const sql = `DELETE FROM vouchers WHERE voucherID = ?`;
        db.query(sql, [id], callback);
    }
};

module.exports = Voucher;