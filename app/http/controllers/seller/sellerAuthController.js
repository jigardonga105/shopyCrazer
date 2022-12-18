const User = require('../../../models/user')
const bcrypt = require('bcrypt');
const passport = require('passport');
const validator = require('validator');

function sellerAuthController() {

    return {
        sellerSignup(req, res) {
            res.render('auth/sellerSignup');
        },

        sellerLogin(req, res) {
            res.render('auth/sellerLogin')
        },

        async sellerSignupPost(req, res) {
            const { fname, lname, email, phone, password } = req.body

            let productPictures = [];

            if (req.files.length > 0) {
                productPictures = req.files.map((file) => {
                    return { img: file.filename };
                });
            }

            if (!fname || !lname || !email || !phone) {
                req.flash('error', 'All fields are required')
                req.flash('fname', fname)
                req.flash('lname', lname)
                req.flash('email', email)
                req.flash('phone', phone)
                return res.redirect('/sellerReg')
            }

            const isEmail = validator.isEmail(email)
            if (!isEmail) {
                req.flash('error', 'Email is not a valid')
                req.flash('fname', fname)
                req.flash('lname', lname)
                req.flash('phone', phone)
                return res.redirect('/sellerReg')
            }

            User.exists({ email: email, role: 'seller' }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email already taken')
                    req.flash('fname', fname)
                    req.flash('lname', lname)
                    req.flash('phone', phone)
                    return res.redirect('/sellerReg')
                }
            })

            const hashPassword = await bcrypt.hash(password, 10)

            const user = new User({
                first_name: fname,
                last_name: lname,
                email,
                phone,
                password: hashPassword,
                role: 'seller',
                image: productPictures
            })

            user.save()
                .then((user) => {
                    req.flash('success', 'Account created. Login now!')
                    return res.redirect('/sellerLog')
                })
                .catch((error) => {
                    req.flash('error', 'Something went wrong')
                    return res.redirect('/sellerReg')
                })
        },

        async sellerLoginPost(req, res, next) {
            const { email, password } = req.body

            if (!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/sellerLog')
            }

            const isEmail = validator.isEmail(email)
            if (!isEmail) {
                req.flash('error', 'Email is inValid')
                return res.redirect('/sellerLog')
            }

            await User.exists({ email: email, role: 'customer' }, (err, result) => {
                if (err) {
                    req.flash('error', 'Something went wrong')
                    return res.redirect('/sellerLog')
                }

                if (result) {
                    req.flash('error', 'User not found')
                    return res.redirect('/sellerLog')

                } else {
                    passport.authenticate('local', (err, user, info) => {
                        if (err) {
                            req.flash('error', info.message)
                            return res.redirect('/sellerLog')
                        }
        
                        if (!user) {
                            req.flash('error', info.message)
                            return res.redirect('/sellerLog')
                        }

                        req.login(user, (err) => {
                            if (err) {
                                req.flash('error', info.message)
                                return res.redirect('/sellerLog')
                            } else {
                                return res.redirect('/')
                            }
                        })
                    })(req, res, next)
                }
            })

        }
    }

}

module.exports = sellerAuthController;