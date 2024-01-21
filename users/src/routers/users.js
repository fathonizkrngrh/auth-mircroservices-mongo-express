const express = require('express');
const userController = require('../controllers/users');
const userValidation = require('../utils/validations/users');
const { cache } = require('../middlewares/cache');

const router = express.Router();

router.post("/", userValidation.createUser, userController.createUser);
router.get("/detail", userValidation.getUser, userController.getUser);
router.get("/", cache ,userValidation.getUsers, userController.getUsers);
router.patch("/", userValidation.updateUser, userController.updateUser);
router.patch("/delete", userValidation.deleteUser, userController.deleteUser);

module.exports = router;