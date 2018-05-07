const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
    res.render('login', {title: 'Login'})
};

exports.registerForm = (req,res) => {
  res.render('register', {title:'Register'});
};

exports.validateRegister = (req,res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', "Name no puede estar vacio").notEmpty();
    req.checkBody('email', "No es un email valido").isEmail();
    req.sanitizeBody('email').normalizeEmail({
        gmail_remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', "Password no puede estar vacio").notEmpty();
    req.checkBody('password-confirm', 'Confirm password no puede estar vacio').notEmpty();
    req.checkBody('password-confirm', "Las contraseñas no coinciden").equals(req.body.password);

    const errors = req.validationErrors();
    if(errors){
        req.flash('error', errors.map(err => err.msg));
        res.render('register', {title: 'Register', body: req.body, flashes: req.flash()});
        return;
    }

    next();

};

exports.register = async (req, res, next) => {
    const user = new User({email:req.body.email,name:req.body.name});
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    next();
};

exports.account = (req, res) => {
  res.render('account', {title: "Editar tu perfil"});
};

exports.updateAccount = async (req, res) => {
  const updates = {
      name: req.body.name,
      email: req.body.email
  };

  const user = await User.findOneAndUpdate(
      {_id: req.user._id},
      {$set: updates},
      {new: true, runValidators: true, context: 'query'}
  );

  req.flash('success', 'Actualizado con exito');
  res.redirect('back');
};