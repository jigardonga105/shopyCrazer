function myAccountController() {
    return {
        async index(req, res) {
            return res.render('myAcc');
        }
    }
}

module.exports = myAccountController;