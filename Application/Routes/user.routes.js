var express = require('express')
const router = express.Router();
expressValidator = require('express-validator')
var userController = require('../Controller/user.controller')
router.use(expressValidator())
router.post('/SignUp',userController.createUser)
//router.post('/create',userController)
router.get('/verify/:token',userController.confirmAccount)
router.post('/login',userController.login)
module.exports = router;