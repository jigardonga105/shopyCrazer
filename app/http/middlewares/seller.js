function seller(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'seller') {
        return next()
    }
    return res.redirect('/')
}

module.exports = seller