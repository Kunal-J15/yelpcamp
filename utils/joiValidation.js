const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');
const extention = (joi)=>({
  type:'string',
  base:joi.string(),
  messages:{
    'string.escapeHTML':'{{#lable}} must not include HTML!'
  },
  rules:{
    escapeHTML:{
      validate(value,helpers){
        const clean =sanitizeHtml(value,{
          allowedTags:[],
          allowedAttributes:{},
        })
        if(clean!==value) return helpers.error('string.escapeHTML',{ value })
        return clean;
      }
    }
  }
})
const Joi = BaseJoi.extend(extention);


module.exports.reviewSchema = Joi.object({
  Review:Joi.object({
  rating :Joi.number().min(1).max(5).required(),
  body:Joi.string().required().escapeHTML()
}).required()});

module.exports.campValid = Joi.object({
  Campground:Joi.object({
    name:Joi.string().required().escapeHTML(),
    // image:Joi.object({
    //   url:Joi
    // }).required(),
    price:Joi.number().min(0).required(),
    description:Joi.string().required().escapeHTML(),
    location:Joi.string().required().escapeHTML(),
}).required(),
  deleteImages:Joi.array()});
