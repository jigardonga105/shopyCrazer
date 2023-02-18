function seller(req, res, next) {
    if (req.session.user._id && req.session.user.role === 'seller') {
        return next()
    }
    return res.redirect('/')
}

module.exports = seller