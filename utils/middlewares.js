const {campValid,reviewSchema} = require('../utils/joiValidation.js');
const Campground = require('../models/campground.js');
const ExpressError = require('./ExpressError.js')
const Review = require('../models/review.js')
const catchAsync = require('./catchAsync.js');

module.exports.isLoggedIn = function(req,res,next){
  if(!req.isAuthenticated()){
    req.session.path =req.originalUrl;
    req.flash('error','You must log in first');
    return res.redirect('/login')
  }
  next();
}

module.exports.isAuthor = catchAsync(async function(req,res,next){
  const {id} = req.params;
  const camp = await Campground.findById(id);
  if(!camp.author.equals(req.user._id)){
    req.flash('error','you are not author')
    res.redirect(`/camp/${id}`);
  }else{
    next();
}})

module.exports.campValMiddleware = function(req,res,next){
  const { error } = campValid.validate(req.body);
  if(error){
    const msg=error.details.map(el=>el.message).join(',');
    throw new ExpressError(msg,400);
  }
  else next();
}
module.exports.isReviewAuthor = catchAsync(async function(req,res,next){
  const {id,revId}=req.params;
  const review = await Review.findById(revId);
  if(review.author._id.equals(req.user._id)){
    return next();
  }
 req.flash('error','you are not author');
 res.redirect('/camp/'+id)
})
module.exports.reviewValMiddleware = function(req,res,next){
  const { error } = reviewSchema.validate(req.body);
  if(error) next(error);
  else next()
}
