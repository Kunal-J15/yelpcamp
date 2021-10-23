const cities = require('./cities.js');
const {places,descriptors} = require('./seedHelpers.js');
const mongoose = require('mongoose');
const Campground = require('../models/campground.js');

mongoose.connect('mongodb://localhost:27017/temp', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to DB");
});
let findDis=arr=>arr[Math.floor(Math.random()*arr.length)];
async function seedDb(){
await  Campground.deleteMany({});

for(let i=0;i<500;i++){
  let rand = Math.floor(Math.random()*1000);
  let price = Math.floor(Math.random()*20)+10;
  let location = `${cities[rand].city}, ${cities[rand].state}`;
  let name = findDis(descriptors)+" "+findDis(places);
  let temp = new Campground({
    name,
    location,
    geometry:{
      type:"Point",
      coordinates:[cities[rand].longitude,cities[rand].latitude]
    },
    images:[
      {
        url:'https://res.cloudinary.com/eagleinthesky/image/upload/v1631865269/yelpCamp/monxteavoboszgv1rjio.jpg',
        fileName:'yelpCamp/monxteavoboszgv1rjio'
      },
      {
        url:'https://res.cloudinary.com/eagleinthesky/image/upload/v1631865269/yelpCamp/xg7s9epr3oewims3frw6.jpg',
        fileName:'yelpCamp/xg7s9epr3oewims3frw6'
      },
      {
        url:'https://res.cloudinary.com/eagleinthesky/image/upload/v1631865269/yelpCamp/rmyfrttznalnuwn5zhrl.jpg',
        fileName:'yelpCamp/rmyfrttznalnuwn5zhrl'
      }
    ],
    description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut umkklf nsajjd os jwusiana msiwos",
    price,
    author:'613b1ac36fa11750042e7b2b'
    });
  await temp.save();
}
}
seedDb();
