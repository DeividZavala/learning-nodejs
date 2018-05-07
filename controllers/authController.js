const passport = require('passport');

exports.login = passport.authenticate('local', {
    failureRedrect: '/login',
    failureFlash: "Fallo en autenticación",
    successRedirect: '/',
    successFlash: "Logueado con Exito"
});