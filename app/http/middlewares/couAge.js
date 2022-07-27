function couAge(req, res, next) {
    if (req.isAuthenticated() && req.session.courierAgents.role === 'courierAgent') {
        return next()
    }
    return res.redirect('/')
}

module.exports = couAge