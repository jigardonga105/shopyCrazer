const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport');

function authController() {
    return {
        async login(req, res) {
            return res.render('auth/login')
        },
        async signup(req, res) {
            return res.render('auth/signup')
        },


        async signupPost(req, res) {
            const { fname, lname, email, phone, password } = req.body

            let productPictures = [];

            if (req.files.length > 0) {
                productPictures = req.files.map((file) => {
                    return { img: file.filename };
                });
            }

            //Validate request
            if (!fname || !lname || !email || !phone || !password) {
                req.flash('error', 'All fields are required')
                req.flash('fname', fname)
                req.flash('lname', lname)
                req.flash('email', email)
                req.flash('phone', phone)
                return res.redirect('/signup')
            }

            //Check if email exists
            User.exists({ email: email, role: 'customer' }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email already taken')
                    req.flash('fname', fname)
                    req.flash('lname', lname)
                    req.flash('phone', phone)
                    return res.redirect('/signup')
                }
            })

            //Hash Password
            const hashPassword = await bcrypt.hash(password, 10)

            //Create a new user
            const user = new User({
                first_name: fname,
                last_name: lname,
                email,
                phone,
                password: hashPassword,
                image: productPictures
            })

            user.save()
                .then((user) => {
                    // console.log(user);
                    return res.redirect('/login')
                })
                .catch((err) => {
                    req.flash('error', 'Something went wrong')
                        // console.log(err);
                    return res.redirect('/signup')
                })
        },

        async loginPost(req, res, next) {
            const { email, password } = req.body

            //Validate request
            if (!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }

            User.exists({ email: email, role: 'seller' }, (err, result) => {
                if (result) {
                    req.flash('error', 'User not found')
                    return res.redirect('/login')
                }
            })

            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message)
                    return res.redirect('/')
                }

                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }

                req.login(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return res.redirect('/')
                    }
                    return res.redirect('/')
                })
            })(req, res, next)
        },

        logout(req, res) {
            req.logout();
            return res.redirect('/');
        }
    }
}

module.exports = authController