const Perfume = require('../models/Perfume');
const Review = require('../models/Review');

const PerfumeController = {
  getAllPerfumes: (req, res) => {
    Perfume.getAllPerfumes((err, perfumes) => {
      if (err) {
        return res.status(500).send('Failed to load perfumes.');
      }
      res.render('inventory', { perfumes });
    });
  },

  getAllPerfumesShopping: (req, res) => {
    Perfume.getAllPerfumes((err, perfumes) => {
      if (err) {
        return res.status(500).send('Failed to load perfumes.');
      }
      res.render('shopping', { perfumes });
    });
  },

  renderAddPerfume: (req, res) => {
    res.render('addPerfume');
  },

  getPerfumeById: (req, res) => {
    const { id } = req.params;
    Perfume.getPerfumeById(id, (err, perfume) => {
      if (err) {
        return res.status(500).send('Failed to load perfume.');
      }
      if (!perfume) {
        return res.status(404).send('Perfume not found.');
      }
      // fetch reviews for this perfume
      Review.getReviewsByPerfume(id, (err2, reviews) => {
        if (err2) {
          // still render perfume but with empty reviews
          return res.render('perfume', { perfume, reviews: [] });
        }
        res.render('perfume', { perfume, reviews });
      });
    });
  },

  

  renderEditPerfume: (req, res) => {
    const { id } = req.params;
    Perfume.getPerfumeById(id, (err, perfume) => {
      if (err) {
        return res.status(500).send('Failed to load perfume.');
      }
      if (!perfume) {
        return res.status(404).send('Perfume not found.');
      }
      res.render('editPerfume', { perfume });
    });
  },
  
  addPerfume: (req, res) => {
    const perfumeData = {
      perfumeName: req.body.perfumeName,
      perfumeDescription: req.body.perfumeDescription,
      gender: req.body.gender,
      perfumeNotes: req.body.perfumeNotes,
      quantity: req.body.quantity,
      price: req.body.price,
      image: req.body.image,
    };

    Perfume.addPerfume(perfumeData, (err) => {
      if (err) {
        return res.status(500).send('Failed to add perfume.');
      }
      res.redirect('/inventory');
    });
  },

  updatePerfume: (req, res) => {
    const { id } = req.params;
    const perfumeData = {
      perfumeName: req.body.perfumeName,
      perfumeDescription: req.body.perfumeDescription,
      gender: req.body.gender,
      perfumeNotes: req.body.perfumeNotes,
      quantity: req.body.quantity,
      price: req.body.price,
      image: req.body.image,
    };

    Perfume.updatePerfume(id, perfumeData, (err) => {
      if (err) {
        return res.status(500).send('Failed to update perfume.');
      }
      res.redirect('/inventory');
    });
  },

  deletePerfume: (req, res) => {
    const { id } = req.params;
    Perfume.deletePerfume(id, (err) => {
      if (err) {
        return res.status(500).send('Failed to delete perfume.');
      }
      res.redirect('/inventory');
    });
  },
};

module.exports = PerfumeController;
