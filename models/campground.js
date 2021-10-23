const mongoose = require('mongoose');
const Review = require('./review.js');
const catchAsync = require('../utils/catchAsync.js');

const campgroundSchema = new mongoose.Schema({
  name:{
    type:String,
    required: true
  },
  images:[{
    url:String,
    fileName:String
  }],
  price:{
    type:Number,
    min:0,
    required: true
  },
  description:{
    type:String,
    required: true
  },
  location:{
    type:String,
    required: true
  },
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required:true
    },
    coordinates:{
      type: [Number],
      required:true
    }
  },
  author:{
    type:mongoose.Schema.Types.ObjectId, ref:'User'
  },
  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId, ref:"Review"
    }
  ]
},{// to add virtuals in .Json file
  toJSON: {
    virtuals: true
  }})
campgroundSchema.virtual('properties.popUpMarkup').get(function(){
  return `<strong><a href='/camp/${this._id}'>${this.name}</a></strong>
  <p>${this.description.substring(0,25)}...`
})

campgroundSchema.post("findOneAndDelete", catchAsync(async function(camp) {

  const del = await Review.deleteMany({_id:{$in:camp.reviews}})
}))
// campgroundSchema.post("find", async function(camps) {
//   for(let camp of camps){
//     const del = await Review.deleteMany({_id:{$in:camp.reviews}})
//   }
// })

module.exports = mongoose.model('Campground',campgroundSchema);
