const express = require('express');
const route = express.Router({mergeParams:true});

const Campground = require('../models/campground.js');
const Review = require('../models/review.js');
const catchAsync = require('../utils/catchAsync.js');
const {isLoggedIn,reviewValMiddleware,isReviewAuthor} = require('../utils/middlewares.js');
const reviewC = require('../controllers/reviews.js')


route.route('/')
   .get(reviewC.gotoCamp)
   .post(isLoggedIn,reviewValMiddleware,catchAsync(reviewC.addReview))

route.delete('/:revId',isLoggedIn,isReviewAuthor,catchAsync(reviewC.deleteReview))
module.exports=route;
