function auth(req, res, next) {
    if (req.session.user._id) {
        return next();
    }
    return res.redirect('/login');
}

module.exports = auth;