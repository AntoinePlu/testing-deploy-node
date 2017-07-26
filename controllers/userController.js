const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.validateRegister = (req, res, next) => { // utiliser next quand c'est un middleware
  req.sanitizeBody('name');
  req.checkBody('name', 'You msut supply a name!').notEmpty(); //notEmpty pour etre sur que l'utilisateur a bien rempli le champ
  req.checkBody('email', 'That EMail is niot valid!').notEmpty(); 
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirm Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Oooops! Your passwords do not match').equals(req.body.password); //verify that both emails are the same

  const errors = req.validationErrors();
  if(errors) {
    req.flash('error', errors.map(err => err.msg)); // display the related error to the field
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() }); // display again the register form and reuse the data enter by the user
    return; // stop the fn from running
  };
  next(); // there were no errors!
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  //res.send('nice user'); // test if the registration works
  next(); // pass to authController.login
};

exports.account = async (req, res) => {
  //res.send('You are on the account page');
  res.render('account', { title: 'Edit your account' });
}

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };
  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );
  // res.json(user);
  req.flash('success', `Successfully updated your account`);
  res.redirect('back');
}