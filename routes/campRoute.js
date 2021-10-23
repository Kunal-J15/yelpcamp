const express = require('express');
const route = express({mergeParams:true});
// const {reviewSchema} = require('../utils/joiValidation.js');
// const Campground = require('../models/campground.js');
// const Review = require('../models/review.js');

const catchAsync = require('../utils/catchAsync.js');
const camps = require('../controllers/camps')
const {isLoggedIn,campValMiddleware,isAuthor} = require('../utils/middlewares.js');
const multer  = require('multer')
const storage = require('../cloudinary');
const upload = multer(storage);

route.get('/new',isLoggedIn,camps.newForm);

route.route('/:id')
 .patch(isLoggedIn,isAuthor,upload.array('images'),campValMiddleware,catchAsync(camps.saveEdit))
 .delete(isLoggedIn,isAuthor,catchAsync(camps.deleteCamp))
 .get(catchAsync(camps.getCamp))

route.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(camps.editForm));

route.post('/new',isLoggedIn,upload.array('image'),campValMiddleware,catchAsync(camps.addCamp));

module.exports=route;
