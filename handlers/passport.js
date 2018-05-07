const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());