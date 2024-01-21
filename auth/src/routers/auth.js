const express = require('express');
const authController = require('../controllers/auth');
const authValidation = require('../utils/validations/auth');

const router = express.Router();

router.post("/signup", authValidation.signup, authController.signup);
router.post("/signin", authValidation.signin, authController.signin);
router.post("/token", authValidation.checkToken, authController.checkToken);

module.exports = router;