const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const {requireAuthUser} = require("../middlewares/authMiddlewares")


router.use(requireAuthUser)
// CRUD
router.post('/createRating', ratingController.createRating);
router.get('/getAllRatings', ratingController.getAllRatings);
router.get('/getRatingById/:id', ratingController.getRatingById);
router.put('/updateRating/:id', ratingController.updateRating);
router.delete('/deleteRating/:id', ratingController.deleteRating);
router.get("/getRatingsByMatch/:id", ratingController.getRatingsByMatch);
router.get("/getRatingsByPlayer/:id", ratingController.getRatingsByPlayer);
router.get("/getAverageRatingForPlayer/:id", ratingController.getAverageRatingForPlayer);
router.get("/getAverageRatingForTeam/:id", ratingController.getAverageRatingForTeam);

module.exports = router;
