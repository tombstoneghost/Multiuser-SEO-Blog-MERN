const express = require('express');

const router = express.Router();

const {signup, signin, signout, forgotPassword, resetPassword} = require('../controllers/auth');

//validators
const {runValidation} = require('../validators/index');
const {userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator} = require('../validators/auth');

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', userSigninValidator, runValidation, signout);
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword)
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword)

module.exports = router;