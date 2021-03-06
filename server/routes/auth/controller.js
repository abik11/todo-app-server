const repo = require('@repository/users');
const passport = require('passport');
const { getHashedPassword } = require('@utils/bcrypt');

module.exports.loginView = async (req, res, next) => {
    try {
        res.render('auth/login', { 
            message: req.flash('message'),
            error: req.flash('error')
        });
    }
    catch(err){
        next(err);
    }
};

module.exports.registerView = async (req, res, next) => {
    res.render('auth/register');
};

module.exports.login = async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
};

module.exports.logout = async (req, res, next) => {
    req.logout();
    req.flash('message', 'You are logged out');
    res.redirect('/login');
};

module.exports.register = async (req, res, next) => {
    const { name, email, pass1, pass2 } = req.body;
    let errors = [];

    if (!name || !email || !pass1 || !pass2)
        errors.push({ message: 'Fill all the fields' });
    if (pass1 != pass2)
        errors.push({ message: 'Passwords do not match' });
    
    if (errors.length > 0)
        res.render('auth/register', { errors, name, email });
    else {
        try {
            let user = await repo.getUserByEmail(email);
            if(user) {
                errors.push({ message: 'This email is already registered' });
                res.render('auth/register', { errors, name, email });
            }
            else{
                hash = await getHashedPassword(pass1);
                user = await repo.addUser({ name, email, password: hash });
                req.flash('message', 'You can now login');
                res.redirect('/login'); 
            }
        }
        catch(err){
            next(err);
        }
    }
};