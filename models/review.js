const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  body:{
    type:String,
    required:true
  },
  rating:Number,
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});
module.exports= mongoose.model("Review",reviewSchema);
