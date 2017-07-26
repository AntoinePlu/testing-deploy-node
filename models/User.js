const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
	email: {
    type: String,
    unique: true, // avoid to have multiple acocunt with the same email
    lowercase: true,
    trim: true, // delete spaces
    validate: [validator.isEmail, 'Invalid Email Address'], // use validator to verify it's an email
    required: 'Please Supply an email address'
  },
	name: {
    type: String,
    required: 'Please Supply a name',
    trim: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  hearts: [
    { type: mongoose.Schema.ObjectId, ref: 'Store' }
  ]
});

userSchema.virtual('gravatar').get(function() {
  const hash = md5(this.email); // go ask to gravatar the image associate to this email
  return `https://gravatar.com/avatar/${hash}?=200`; // return the user avatar in 200px 
})

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);