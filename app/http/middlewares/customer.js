function admin(req, res, next) {
    if (req.session.user._id && req.session.user.role === 'customer') {
        return next()
    }
    return res.redirect('/')
}

module.exports = admin