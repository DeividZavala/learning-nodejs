const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({

    email:{
        lowercase: true,
        unique: true,
        required: "Proporciona un email",
        type: String,
        trim: true,
        validate: [validator.isEmail, "Invalid Email"],
    },
    name: {
        type: String,
        required: "Proporciona un email",
        trim: true
    }

});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);