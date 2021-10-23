const express = require('express');
const route = express.Router({mergeParams:true});
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync.js');
const passport = require('passport');
const userC = require('../controllers/userC');

route.route('/register')
    .get(userC.registerForm)
    .post(catchAsync(userC.register))

route.route('/login')
    .get(userC.loginForm)
    .post(passport.authenticate('local',{failureRedirect: '/login',failureFlash: true}),userC.login)

route.get('/logout',userC.logout);
module.exports = route;
