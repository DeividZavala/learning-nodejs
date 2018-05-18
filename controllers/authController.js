const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local', {
    failureRedrect: '/login',
    failureFlash: "Fallo en autenticación",
    successRedirect: '/',
    successFlash: "Logueado con Exito"
});

exports.logout = (req,res) => {
  req.logOut();
  req.flash("success", "Desloagueado con exito");
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
      next();
      return;
  }
  req.flash("error", "Necesitas estar logeado");
  res.redirect('/login');
};

exports.forgot = async (req, res) => {

    // check if user exists
    const user = await User.findOne({email:req.body.email});
    if(!user){
        req.flash("error", "No hay usuarios con ese email");
        res.redirect('/login');
    }
    // setting the expiration date and the token
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetExpirationDate = Date.now() + 3600000;
    await user.save();

    // send the email to reset the password
    const reset_url = `${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    req.flash('success', "Email enviado", reset_url);

    //redirect to login
    res.redirect('/login');

};

exports.reset = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken:req.params.token,
        resetExpirationDate: {$gt: Date.now()}
    });

    if(!user){
        req.flash('error', 'El token a expirado o esta mal');
        res.redirect('/login');
    }

    res.render('reset', {title:"Reset your password"});

};

exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body['password-confirm']) {
        next(); // keepit going!
        return;
    }
    req.flash('error', "Las contras no son las mismas");
    res.redirect('back');
};

exports.update = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken:req.params.token,
        resetExpirationDate: {$gt: Date.now()}
    });
    if(!user){
        req.flash('error', 'El token a expirado o esta mal');
        res.redirect('/login');
    }
    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);
    user.resetExpirationDate = undefined;
    user.resetPasswordToken = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', '💃 Nice! Your password has been reset! You are now logged in!');
    res.redirect('/');
};

