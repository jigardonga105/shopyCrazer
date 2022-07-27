function notcouAge(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'courierAgent') {
        return res.redirect('/courieAgeDashBoard/index')
    }
    return next()
}

module.exports = notcouAge