const Blog = require('../models/blog');
const Category = require('../models/category');
const Tag = require('../models/tag');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const {errorHandler} = require('../helpers/dbErrorHandler');
const fs = require('fs');
const {smartTrim} = require('../helpers/blog');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }

        const {title, body, categories, tags} = fields;

        if(!title || title.length === 0) {
            return res.status(400).json({
                error: 'Title is required'
            });
        }

        if(!body || body.length < 200) {
            return res.status(400).json({
                error: 'Content is too short '
            });
        }

        if(!categories || categories.length === 0) {
            return res.status(400).json({
                error: 'Atleast one category is required'
            });
        }

        if(!tags || tags.length === 0) {
            return res.status(400).json({
                error: 'Atleast one tag is required'
            });
        }

        let blog = new Blog();
        blog.title = title,
        blog.body = body;
        blog.excerpt = smartTrim(body, 320, ' ', '...');
        blog.slug = slugify(title).toLowerCase();
        blog.mtitle = `${title} | ${process.env.APP_NAME}`;
        blog.mdesc = stripHtml(body.substring(0,160)).result;
        blog.postedBy = req.user._id;

        let arrayOfCategories = categories && categories.split(',');
        let arrayOfTags = tags && tags.split(',');

        if(files.photo) {
            if(files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            } 
            blog.photo.data = fs.readFileSync(files.photo.path)
            blog.photo.contentType = files.photo.type;
        }

        console.log('Blog', blog);

        blog.save((err, result) => {
            if(err) {
                console.log(err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            console.log('Results', result);
            //res.json(result);
            Blog.findByIdAndUpdate(result._id, {$push: {categories: arrayOfCategories}}, {new: true})
                .exec((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        })
                    } else {
                        Blog.findByIdAndUpdate(result._id, {$push: {tags: arrayOfTags}}, {new: true})
                            .exec((err, result) => {
                                if(err) {
                                    return res.status(400).json({
                                        error: errorHandler(err)
                                    })
                                } else {
                                    res.json(result);
                                }
                            });
                    }
                });
        });
    });
};

exports.list = (req, res) => {
    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if(err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.listAllBlogsCategoriesTags = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let blogs;
    let categories;
    let tags;

    console.log('In Controller');

    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if(err) {
                console.log(err);
                return res.json({
                    error: errorHandler(err)
                });
            }
            blogs = data;
            console.log('Blogs', blogs);
            Category.find({})
                .exec((err, c) => {
                    if(err) {
                        return res.json({
                            error: errorHandler(err)
                        });
                    }
                    categories = c;
                    Tag.find({})
                        .exec((err, t) => {
                            if(err) {
                                return res.json({
                                    error: errorHandler(err)
                                });
                            }
                            tags = t;
                            res.json({blogs, categories, tags, size: blogs.length});
                        });
                });
        });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if(err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOneAndRemove({slug})
        .exec((err, data) => {
            if(err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json({
                message: 'Blog deleted successfully'
            });
        });
};

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Blog.findOne({slug})
        .exec((err, oldBlog) => {
            if(err) {
                return res.json({
                    error: errorHandler(err)
                });
            }

            let form = new formidable.IncomingForm();
            form.keepExtensions = true;
        
            form.parse(req, (err, fields, files) => {
                if(err) {
                    return res.status(400).json({
                        error: 'Image could not upload'
                    });
                }
        
                let slugBeforeForMerge = oldBlog.slug;
                oldBlog = _.merge(oldBlog, fields);
                oldBlog.slug = slugBeforeForMerge;

                const {body, mdesc, categories, tags} = fields;

                if(body) {
                    oldBlog.excerpt = smartTrim(body, 320, '', '...');
                    oldBlog.mdesc = stripHtml(body.substring(0, 160));
                }

                if(categories) {
                    oldBlog.categories = categories.split(',');
                }

                if(tags) {
                    oldBlog.tags = tags.split(',');
                }
        
                if(files.photo) {
                    if(files.photo.size > 1000000) {
                        return res.status(400).json({
                            error: 'Image should be less than 1mb in size'
                        });
                    } 
                    oldBlog.photo.data = fs.readFileSync(files.photo.path)
                    oldBlog.photo.contentType = files.photo.type;
                }
        
                oldBlog.save((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json(result);
                });
            });
        });
};

exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug})
        .select('photo')
        .exec((err, blog) => {
            if(err || !blog) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.set('Content-Type', blog.photo.contentType);
            
            return res.send(blog.photo.data);
        });
};