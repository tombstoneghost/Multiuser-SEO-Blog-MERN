const User = require('../models/user');
const Blog = require('../models/blog');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const {errorHandler} = require('../helpers/dbErrorHandler');
const user = require('../models/user');

exports.read = (req, res) => {
    req.profile.hashedPassword = undefined;

    return res.json(req.profile);
};

exports.publicProfile = (req, res) => {
    let username = req.params.username;
    let user;
    let blogs;

    User.findOne({username})
        .exec((err, userFromDB) => {
            if(err || !userFromDB) {
                return res.status(400).json({
                    error: 'User not found'
                });
            }
            user = userFromDB;
            let userId = user._id;

            Blog.find({postedBy: userId})
                .populate('categories', '_id name slug')
                .populate('tags', '_id name slug')
                .populate('postedBy', '_id name')
                .limit(10)
                .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
                .exec((err, data) => {
                    if(err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    user.photo = undefined;
                    user.salt = undefined;
                    user.hashedPasword = undefined;
                    res.json({
                        user, 
                        blogs: data
                    });
                });
            });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        let user = req.profile;
        user = _.extend(user, fields);

        if(fields.password && fields.password.length < 6) {
            return res.status(400).json({
                error: 'Password should be minimum 6 characters long'
            });
        }

        if(files.photo) {
            if(fields.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image size could not be greater than 1 Mb'
                }); 
            }
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }
        
        user.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            user.hashedPasword = undefined;
            user.salt = undefined;
            user.photo = undefined;
            res.json(user);
        });
    });
};

exports.photo = (req, res) => {
    const username = req.params.username;
    User.findOne({username})
        .exec((err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                });
            }
            if(user.photo.data) {
                res.set('Content-Type', user.photo.contentType);
    
                return res.send(user.photo.data);
            }
        });
};