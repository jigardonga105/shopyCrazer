const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport');
const fs = require('fs');

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

            if (!req.body.role) {
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
            } else {
                //Check if email exists
                User.exists({ role: 'courier' }, (err, result) => {
                    if (result) {
                        let msg = "existed";
                        return res.redirect(`/adminSection/${msg}`)
                    }
                })
            }


            //Hash Password
            const hashPassword = await bcrypt.hash(password, 10)
            let user;

            if (req.body.role) {
                //Create a new user
                user = new User({
                    first_name: fname,
                    last_name: lname,
                    email,
                    phone,
                    role: req.body.role,
                    password: hashPassword,
                    image: productPictures
                })
            } else {
                //Create a new user
                user = new User({
                    first_name: fname,
                    last_name: lname,
                    email,
                    phone,
                    password: hashPassword,
                    image: productPictures
                })
            }

            user.save()
                .then((user) => {
                    if (req.body.role) {
                        let msg = "created";
                        return res.redirect(`/adminSection/${msg}`)
                    } else {
                        return res.redirect('/login')
                    }
                })
                .catch((err) => {
                    req.flash('error', 'Something went wrong')
                    if (req.body.role) {
                        let msg = "notCreated";
                        return res.redirect(`/adminSection/${msg}`)
                    } else {
                        return res.redirect('/signup')
                    }
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

            if (req.session.courierAgents) {
                req.session.destroy((err) => {
                    if (err) {
                        return console.log(err);
                    }
                });
            }

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
            if (req.session.user) {
                req.logout();
                return res.redirect('/');
            } else {
                req.session.destroy((err) => {
                    if (err) {
                        return console.log(err);
                    }
                    res.redirect('/');
                });
            }
        },

        async deleteAcc(req, res) {
            let user = await User.findById({ _id: req.params.id });

            if (user.role === 'courier') {

                for (let i = 0; i < user.image.length; i++) {
                    let img = user.image[i].img;
                    fs.unlink(`public/uploadedImages/${img}`, (err, res) => {
                        if (err) {
                            let msg = "imgNotDeleted";
                            return res.redirect(`/adminSection/${msg}`)
                        }
                    })
                }

                let del = await User.findByIdAndDelete({ _id: req.params.id });
                if (del) {
                    let msg = "deleted";
                    return res.redirect(`/adminSection/${msg}`)
                } else {
                    let msg = "notDeleted";
                    return res.redirect(`/adminSection/${msg}`)
                }
            }
        }
    }
}

module.exports = authController