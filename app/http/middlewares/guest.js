function guest(req, res, next) {
    //Passport method .isAuthenticated()
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/');
}

module.exports = guest;