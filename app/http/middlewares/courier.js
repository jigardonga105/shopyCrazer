function courier(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'courier') {
        return next()
    }
    return res.redirect('/')
}

module.exports = courier