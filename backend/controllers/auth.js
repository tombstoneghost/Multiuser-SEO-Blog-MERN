const User = require('../models/user');
const Blog = require('../models/blog');
const shortId = require('shortid');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {errorHandler} = require('../helpers/dbErrorHandler');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.read = (req, res) => {
    req.profile.hashedPassword = undefined;

    return res.json(req.profile);
};

exports.signup = (req, res) => {
    User.findOne({email: req.body.email})
        .exec((err, user) => {
            if(err) {
                return res.status(400).json({
                    error: 'E-Mail is already registerted'
                });
            }

            const {name, email, password} = req.body;
            let username = shortId.generate();
            let profile = `${process.env.CLIENT_URL}/profile/${username}`;

            let newUser = new User({name, email, password, profile, username});
            newUser.save((err, success) => {
                if(err) {
                    return res.status(400).json({
                        error: err
                    });
                }
                res.json({
                    message: 'Signup success! Please signin'
                });
            });
        });
};

exports.signin = (req, res) => {
    const {email, password} = req.body;

    User.findOne({email})
        .exec((err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    error: "User with that email does not exist. Please signup"
                });
            }

            if(!user.authenticate(password)) {
                return res.status(400).json({
                    error: "Authentication Failure. Try again"
                });
            }

            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1 d'});

            res.cookie('t', token, {expiresIn: '1 d'});
            const {_id, username, name, email, role} = user;
            return res.json({
                token, user:  {_id, username, name, email, role}
            });
        });
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({
        message: 'Signout Success'
    });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET, algorithms: ['HS256']
});

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id;
    User.findById({_id: authUserId})
        .exec((err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                });
            }
            req.profile = user;
            next();
        });
};

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id;
    User.findById({_id: adminUserId})
        .exec((err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                });
            }

            if(user.role !== 1) {
                return res.status(400).json({
                    error: 'Admin Resource. Access denied'
                });
            }
            req.profile = user;
            next();
        });
};

exports.canUpdateDeleteBlog = (req, res, next) => {
    const slug = req.params.slug.toLowerCase();

    Blog.findOne({slug})
        .exec((err, data) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            let authorizedUser = data.postedBy._id.toString() === req.profile._id.toString();

            if(!authorizedUser) {
                if(err) {
                    return res.status(400).json({
                        error: 'You are not authorized'
                    });
                }
            }
            next();
        });
};

exports.forgotPassword = (req, res) => {
    const {email} = req.body;

    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(401).json({
                error: 'User with that E-Mail does not exist'
            });
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_RESET_PASSWORD, {expiresIn: '10m'});

        const emailData = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: 'Password Reset Link',
            html: `
                <p>Please use the following link to reset the password:</p>
                <p>Reset Password Url: ${proces.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contact sensitive information</p>
                <p>https://seoblog.com</p>
            `
        };

        return User.updateOne({resetPasswordLink: token}, (err, success) => {
            if(err) {
                return res.json({
                    error: errorHandler(err)
                });
            } else {
                sgMail.send(emailData)
                    .then(sent => {
                        return res.json({
                            message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10 minutes.`
                        })
                    });
            }
        });
    
    });
};

exports.resetPassword = (req, res) => {
    const {resetPasswordLink, newPassword} = req.body;

    if(resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if(err) {
                return res.status(401).json({
                    error: 'Link expired. Try again'
                });
            }
            User.findOne({resetPasswordLink}, (err, user) => {
                if(err || !user) {
                    return res.status(401).json({
                        error: 'Something went wrong'
                    });
                }
                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                };

                user = _.extend(user, updatedFields);
                
                user.save((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json({
                        message: `Great! Now you can login with your new password`
                    });
                });
            });
        });
    }
};