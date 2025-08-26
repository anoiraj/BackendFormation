const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

// CRUD
router.post('/createRating', ratingController.createRating);
router.get('/getAllRatings', ratingController.getAllRatings);
router.get('/getRatingById/:id', ratingController.getRatingById);
router.put('/updateRating/:id', ratingController.updateRating);
router.delete('/deleteRating/:id', ratingController.deleteRating);

module.exports = router;
