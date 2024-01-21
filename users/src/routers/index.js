const express = require('express');
const userRouter = require('./users');
const { authentication } = require('../middlewares/authentication');

const router = express.Router();

router.use("/user", authentication, userRouter);

module.exports = router;