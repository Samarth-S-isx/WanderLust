const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router();
const placesControllers = require('../controllers/places-controllers')
const fileUpload = require('../middleware/file-upload')

router.get('/:pid',placesControllers.getPlaceByID);

router.get('/user/:uid',placesControllers.getPlacesByUserID);

router.post('/',fileUpload.single('image') ,placesControllers.createPlace)

router.patch('/:pid',placesControllers.updatePlaceByID);

router.delete('/:pid',placesControllers.deletePlace);


module.exports = router