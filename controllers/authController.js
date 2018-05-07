const passport = require('passport');

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