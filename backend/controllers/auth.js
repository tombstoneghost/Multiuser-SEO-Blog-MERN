const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

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
    secret: process.env.JWT_SECRET, algorithms: ['RS256']
});