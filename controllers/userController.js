const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
    res.render('login', {title: 'Login'})
};

exports.registerForm = (req,res) => {
  res.render('register', {title:'Register'});
};

exports.validateRegister = (req,res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', "Este campo no puede estar vacio").isEmail();
    req.checkBody('email', "No es un email valido").isEmail();
    req.sanitizeBody('email').normalizeEmail({
        gmail_remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', "Este campo no puede estar vacio").notEmpty();
    req.checkBody('password-confirm', 'Este campo no puede estar vacio').notEmpty();
    req.checkBody('password-confirm', "Las contraseñas no coinciden").equals(req.body.password);

    const errors = req.validationErrors();
    if(errors){
        req.flash('error', errors.map(err => err.msg));
        req.render('register', {title: 'Register', body: req.body, flashes: req.flash()});
        return;
    }

    next();

};