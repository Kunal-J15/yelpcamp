const Campground = require('../models/campground.js');
// const Review = require('../models/review.js');
const cloudinary = require('cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken  = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.newForm = (req,res)=>{
 res.render('new');
}
module.exports.getCamp = async(req,res,next)=>{
  let {id}=req.params;
  let camp = await Campground.findById(id).populate({
    path:'reviews',
    populate:{
      path:'author'}
    }).populate('author');
  if(!camp){
    req.flash("error",'Can not find campground ')
    res.redirect('/')
  }
  res.render('camp',{camp});
}
module.exports.editForm = async(req,res)=>{
  let {id}=req.params;
  let camp = await Campground.findById(id);
  if(!camp){
    req.flash("error",'Can not find campground ')
    res.redirect('/')
  }
  camp.images.forEach((img, i) => {
  img.url=cloudinary.url(img.fileName, {width: 300})
  });

  res.render('edit',{camp});
};

module.exports.addCamp = async(req,res,next)=>{
 const geoData =  await geocoder.forwardGeocode({
    query: req.body.Campground.location,
    limit: 1
}).send();
  const camp = new Campground({...req.body.Campground});
  camp.geometry=geoData.body.features[0].geometry;
  camp.author = req.user._id;
  camp.images=req.files.map(f=>{
    return { url:f.path,fileName:f.filename }
  })
  await camp.save();
  if(!camp){
    req.flash("error",'Can not find campground')
    route.redirect('/');
  }
  req.flash('success','successuly added')
  res.redirect('/');
}

module.exports.saveEdit = async(req,res)=>{
  let {id}=req.params;
  let camp=await Campground.findByIdAndUpdate(id,{...req.body.Campground});
  let img = req.files.map(f=>{return { url:f.path,fileName:f.filename }})
  camp.images.push(...img);
  await camp.save();
  if(req.body.deleteImages){
    // for(let file of req.body.deleteImages){
    //   await cloudinary.uploader.destroy(file);
    // }
    await camp.updateOne({$pull:{images:{fileName:{$in:req.body.deleteImages}}}});
  }
  if(!camp){
    req.flash("error",'Can not find campground ')
    res.redirect('/')
  }
  req.flash('success','successuly edited camp');
  res.redirect(`/camp/${id}`);
}

module.exports.deleteCamp = async (req,res)=>{
  let {id}=req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success','successuly Deleted campground')
  res.redirect('/')
}
