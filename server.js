//Requiring Modules:-
require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 8000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
const passport = require('passport');
const Emitter = require('events')
const multer = require("multer");

// Database connection:-
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    })
    .then(() => {
        console.log('Database connection established...');
    })
    .catch((err) => {
        console.log(err);
    })

//session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: process.env.MONGO_CONNECTION_URL
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}))

//Passport config
const passportInit = require('./app/config/passport')
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

// Assets 
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Store Image using Multer
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploadedImages');
    },
    filename: (req, file, callback) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
            return callback(message, null);
        }

        var filename = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
        callback(null, filename)
    }
})
app.use(multer({ storage: storage }).any("image"))
    //==============================================================================================

//Global middlewares
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)


//Server Listening
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})