if(process.env.NODE_ENV!=='production'){
   require('dotenv').config();
}
const express = require('express');
const app=express();
const ExpressError = require('./utils/ExpressError.js');
const catchAsync = require('./utils/catchAsync.js');
const mongoose = require('mongoose');
const Campground = require('./models/campground.js');
const Review = require('./models/review.js');
const User = require('./models/user.js');
const passport = require('passport');
const localStratergy = require('passport-local')
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session');
const MongoStore = require("connect-mongo").default;
app.use(express.static(`${__dirname}/public`))

const dbUrl = process.env.DB_URL||'mongodb://localhost:27017/temp';
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex:true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to DB");
});

const secret = process.env.SECRET || 'keyboard cat';
// const MongoStore = mongoSessionStore(session)
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
  store,
  name:'obj_s',
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
  httpOnly:true,
  // secure:true,
  expires:Date.now()+1000*60*60*24,
  maxAge:1000*60*60*24
  }
}
app.use(session(sessionConfig));
const flash = require('connect-flash');
app.use(flash());
app.use(helmet());
app.use(mongoSanitize({
  replaceWith:'_'
}))
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/eagleinthesky/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',`${__dirname}/views`);
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));

app.use((req,res,next)=>{
  res.locals.curUser=req.user;
  res.locals.success =req.flash("success");
  res.locals.error =req.flash("error")
  next();
})
// const {isLoggedIn,campValMiddleware,isAuthor} = require('./utils/middlewares.js');
const campRoute = require('./routes/campRoute.js');
const reviewRoute = require('./routes/reviewRoute.js');
const userRoute = require('./routes/userRoute.js');


app.use("/camp",campRoute);
app.use("/camp/:id/review",reviewRoute)
app.use('',userRoute)
app.get('/camps',catchAsync(async (req,res,next)=>{
  const camps =await Campground.find({});
  res.render('home',{camps})
}))


app.get('/',(req,res,next)=>{
  res.render('main')
})
app.all('/',(req,res,next)=>{
  next( new ExpressError("page not found",404));
})

app.use((err,req,res,next)=>{
  console.log(err);
  res.render('error',{err})
})
const port = process.env.PORT||3000;
app.listen(3000,()=>{
  console.log(`listning on port ${port}`);
})
