const db = require('../db');

const Perfume = {
  getAllPerfumes: (callback) => {
    const sql =
      'SELECT perfumeId, perfumeName, perfumeDescription, gender, perfumeNotes, quantity, price, image FROM perfumes';
    db.query(sql, callback);
  },

  getPerfumeById: (perfumeId, callback) => {
    const sql =
      'SELECT perfumeId, perfumeName, perfumeDescription, gender, perfumeNotes, quantity, price, image FROM perfumes WHERE perfumeId = ?';
    db.query(sql, [perfumeId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0] || null);
    });
  },

  addPerfume: (perfumeData, callback) => {
    const {
      perfumeName,
      perfumeDescription,
      gender,
      perfumeNotes,
      quantity,
      price,
      image,
    } = perfumeData;

    const sql =
      'INSERT INTO perfumes (perfumeName, perfumeDescription, gender, perfumeNotes, quantity, price, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [
      perfumeName,
      perfumeDescription,
      gender,
      perfumeNotes,
      quantity,
      price,
      image,
    ];

    db.query(sql, values, callback);
  },

  updatePerfume: (perfumeId, perfumeData, callback) => {
    const {
      perfumeName,
      perfumeDescription,
      gender,
      perfumeNotes,
      quantity,
      price,
      image,
    } = perfumeData;

    const sql =
      'UPDATE perfumes SET perfumeName = ?, perfumeDescription = ?, gender = ?, perfumeNotes = ?, quantity = ?, price = ?, image = ? WHERE perfumeId = ?';
    const values = [
      perfumeName,
      perfumeDescription,
      gender,
      perfumeNotes,
      quantity,
      price,
      image,
      perfumeId,
    ];

    db.query(sql, values, callback);
  },

  deletePerfume: (perfumeId, callback) => {
    const sql = 'DELETE FROM perfumes WHERE perfumeId = ?';
    db.query(sql, [perfumeId], callback);
  },
};

module.exports = Perfume;