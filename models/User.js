const db = require('../db');
User = {
    //--user side--
    //adds a new user into db
    addUser: (userdetails, callback) => {
        checksql = 'SELECT * FROM users WHERE username = ? OR email = ?';
        db.query(checksql, [userdetails.username, userdetails.email], (err, results) => {
            if (err) return callback(err);
            if (results.length > 0) {
                return callback(new Error('Username or email already exists'));
            } else {
                const sql = 'INSERT INTO users (username, password, email, contact) VALUES (?, ?, ?, ?, NOW())';
                params = [
                    userdetails.username,
                    userdetails.password, 
                    userdetails.email, 
                    userdetails.contact
                ];
                db.query(sql, params, (err, results) => {
                    if (err) return callback(err);
                    callback(null, results);
                });
            }
        });
    },
    //logs in user
    loginUser: (username, password, callback) => {
        const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
        db.query(sql, [username, password], (err, result) => {
            if (err) return callback(err);
            if (result.length === 0) {
                return callback(new Error('Invalid username or password'));
            }
            callback(null, result[0]);
        });
    },

    //--admin side--
    getbyId: (userId, callback) => {
        const sql = 'SELECT * FROM users WHERE userId = ?';
        db.query(sql, [userId], (err, result) => {
            if (err) return callback(err);
            if (result.length === 0) {
                return callback(new Error('User not found'));
            }
            callback(null, result[0]);
        });
    },

    updateProfile: (userId, updatedDetails, callback) => {
        const sql = 'UPDATE users SET email = ?, contact = ?, password = ? WHERE userId = ?';
        const params = [
            updatedDetails.email,
            updatedDetails.contact,
            updatedDetails.password,
            userId
        ];
        db.query(sql, params, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },

    getAll: (search, sort, callback) => {
        search = search ? search.trim() : '';
        sort = sort === 'asc' ? 'ASC' : 'DESC'; // default: newest first
        let sql = `
            SELECT userId, username, email, contact, role, banned, createdAt FROM users
        `;
        const params = [];
        if (search) {
            sql += ` WHERE username LIKE ?`;
            params.push(`%${search}%`);
        }
        sql += ` ORDER BY createdAt ${sort}`;
        db.query(sql, params, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
};

module.exports = User;