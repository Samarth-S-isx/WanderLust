const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router();
const userControllers = require('../controllers/users-controllers')
const fileUpload = require('../middleware/file-upload')

router.get('/',userControllers.getUsers);

router.post('/signup', fileUpload.single('image') ,userControllers.signup)

router.post('/login',userControllers.login);




module.exports = router 