function guest(req, res, next) {
    //Passport method .isAuthenticated()
    if (!req.session.user._id || !req.session.courierAgents._id) {
        return next();
    }
    return res.redirect('/');
}

module.exports = guest;