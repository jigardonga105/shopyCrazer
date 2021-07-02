const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const catProdShowController = require('../app/http/controllers/catProdShowController')
const sellerAuthController = require('../app/http/controllers/seller/sellerAuthController')
const sellerStoreController = require('../app/http/controllers/seller/storeController')
const sellerProductController = require('../app/http/controllers/seller/prodController')
const myAccountController = require('../app/http/controllers/myAccountController')

const guest = require('../app/http/middlewares/guest')
const admin = require('../app/http/middlewares/admin')
const auth = require('../app/http/middlewares/auth')
const customer = require('../app/http/middlewares/customer')
const seller = require('../app/http/middlewares/seller')

function initRoutes(app) {
    app.get('/', homeController().home)
    app.get('/index', homeController().home)
    app.get('/about', homeController().about)
    app.get('/contact', homeController().contact)
    app.get('/shop', homeController().shop)
    app.get('/shop-single', homeController().shopSingle)

    app.get('/login', guest, authController().login)
    app.get('/signup', guest, authController().signup)
    app.post('/login', authController().loginPost)
    app.post('/signup', authController().signupPost)
    app.get('/logout', authController().logout)

    //For Seller Registration
    app.get('/sellerReg', guest, sellerAuthController().sellerSignup)
    app.post('/sellerReg', sellerAuthController().sellerSignupPost)

    //For Seller Login
    app.get('/sellerLog', guest, sellerAuthController().sellerLogin)
    app.post('/sellerLog', sellerAuthController().sellerLoginPost)

    //For seller add it's store, customize it's store and delete
    app.get('/seller/sellerStr', seller, sellerStoreController().index)
    app.post('/add-store', sellerStoreController().addStore)
    app.get('/seller/storeCust/:storeID', seller, sellerStoreController().editStore)
    app.post('/seller/updatestore/:storeID', sellerStoreController().updateStore)
    app.post('/store-add-img/:storeID', sellerStoreController().storeAddImg)
    app.post('/deleteImgStore/:img/:strID', sellerStoreController().deleteStrImage)
    app.post('/seller/deleteStr/:strID', sellerStoreController().deleteStr)

    //For seller view your store products and customize that
    app.get('/seller/store/:strID', seller, sellerProductController().index)
    app.post('/add-product', seller, sellerProductController().addProduct)
    app.get('/seller/product/:prdID', seller, sellerProductController().showProduct)
    app.get('/seller/productUpdate/:prdID', seller, sellerProductController().updateProduct)
    app.post('/deleteImgItem/:img/:prdID', sellerProductController().deleteItemImage)
    app.post('/product-add-img/:prdID', sellerProductController().addItemImage)
    app.post('/seller/updateitem/:prdID', sellerProductController().updateProdPost)
    app.post('/seller/deletePrd/:prdID', sellerProductController().deletePrd)

    //this is for show product when click on Category Navbar
    app.get('/category/:category', catProdShowController().showCategory)
    app.get('/category/:category/:subCategory', catProdShowController().showSubCategory)
    app.get('/productview/:prdID', catProdShowController().viewProduct)

    //this is for my Account
    app.get('/myAccount', auth, myAccountController().index);
    app.post('/otp', myAccountController().otp);
    app.post('/changeMyAcc', myAccountController().changeMyAcc);
    // app.post('/changeMyAccImg', myAccountController().changeMyAccImg);

}

module.exports = initRoutes