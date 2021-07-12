function orderController() {
    return {
        async index(req, res) {
            res.render('customers/placeOrd');
        },
    }
}

module.exports = orderController