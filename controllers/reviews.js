const Campground = require('../models/campground.js');
const Review = require('../models/review.js');

module.exports.gotoCamp =(req,res,next)=>{
  const {id} = req.params;
  res.redirect('/camp/'+id);
}
module.exports.deleteReview = async(req,res,next)=>{
  const {id,revId}=req.params;
  const review = await Review.deleteOne({_id:revId});
  const camp = await Campground.findByIdAndUpdate(id,{$pull:{reviews:{$in:revId}}})
  await camp.save();
  req.flash('success','successuly Deleted review')
  res.redirect('/camp/'+id);
}

module.exports.addReview = async(req,res)=>{
  let {id}=req.params;
  let camp = await Campground.findById(id).populate("reviews");
  let review = new Review(req.body.Review);
  review.author=req.user._id;
  camp.reviews.push(review)
  await camp.save();
  await review.save();
  req.flash('success','review added')
  res.redirect(`/camp/${id}`);
}
