const User = require('../models/user.js');
module.exports.register = async(req,res,next)=>{
  try{
  const {username,email,password}=req.body;
  const user =new User({username,email});
  let userid = await User.register(user,password);
  req.login(userid,(err)=>{
    if(err){
      next(err);
    }
    req.flash('success','registerred successfully')
    return res.redirect('/');
  })}
  catch(e){
    req.flash('error',e.message);
    return res.redirect('/register');
  }};

module.exports.registerForm = (req,res,next)=>{
  res.render('register')
};

module.exports.loginForm = (req,res,next)=>{
  res.render('login')
}
module.exports.login = (req,res,next)=>{
  let redirect = req.session.path||'/';
  delete req.session.path;
  res.redirect(redirect);
};
module.exports.logout = (req,res,next)=>{
  req.logout();
  req.flash('success','GoodBuy');
  res.redirect('/');
};
