const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const catProdShowController = require('../app/http/controllers/catProdShowController')
const sellerAuthController = require('../app/http/controllers/seller/sellerAuthController')
const sellerStoreController = require('../app/http/controllers/seller/storeController')
const sellerProductController = require('../app/http/controllers/seller/prodController')
const myAccountController = require('../app/http/controllers/myAccountController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminSectionController = require('../app/http/controllers/admin/adminSectionController')
const courierSectionController = require('../app/http/controllers/courier/courierSectionController')
const CourierAgentDashboardController = require('../app/http/controllers/courier/CoAgDashboardController')
const postCommentController = require('../app/http/controllers/customers/postCommentController')
const buyNowController = require('../app/http/controllers/customers/buyNowController')

const guest = require('../app/http/middlewares/guest')
const admin = require('../app/http/middlewares/admin')
const auth = require('../app/http/middlewares/auth')
const customer = require('../app/http/middlewares/customer')
const seller = require('../app/http/middlewares/seller')
const courier = require('../app/http/middlewares/courier')
const notcouAge = require('../app/http/middlewares/notcouAge')
const couAge = require('../app/http/middlewares/couAge')

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
    app.post('/deleteAcc/:id', authController().deleteAcc)

    //For Seller Registration
    app.get('/sellerReg', guest, sellerAuthController().sellerSignup)
    app.post('/sellerReg', sellerAuthController().sellerSignupPost)

    //For Seller Login
    app.get('/sellerLog', guest, sellerAuthController().sellerLogin)
    app.post('/sellerLog', sellerAuthController().sellerLoginPost)

    //For seller add it's store, customize it's store and delete
    app.get('/seller/sellerStr', seller, sellerStoreController().index)
    app.post('/add-store', seller, sellerStoreController().addStore)
    app.get('/seller/storeCust/:storeID', seller, sellerStoreController().editStore)
    app.post('/seller/updatestore/:storeID', seller, sellerStoreController().updateStore)
    app.post('/store-add-img/:storeID', seller, sellerStoreController().storeAddImg)
    app.post('/deleteImgStore/:img/:strID', seller, sellerStoreController().deleteStrImage)
    app.post('/seller/deleteStr/:strID', seller, sellerStoreController().deleteStr)

    //For seller view your store products and customize that
    app.get('/seller/store/:strID', seller, sellerProductController().index)
    app.post('/add-product', seller, sellerProductController().addProduct)
    app.get('/seller/product/:prdID', seller, sellerProductController().showProduct)
    app.get('/seller/productUpdate/:prdID', seller, sellerProductController().updateProduct)
    app.post('/deleteImgItem/:img/:prdID', seller, sellerProductController().deleteItemImage)
    app.post('/product-add-img/:prdID', seller, sellerProductController().addItemImage)
    app.post('/seller/updateitem/:prdID', seller, sellerProductController().updateProdPost)
    app.post('/seller/deletePrd/:prdID', seller, sellerProductController().deletePrd)

    //this is for show product when click on Category Navbar
    app.get('/category/:category', catProdShowController().showCategory)
    app.get('/category/:category/:subCategory', catProdShowController().showSubCategory)
    app.get('/productview/:prdID', catProdShowController().viewProduct)
    // app.get('/productview/:prdID/:msg', catProdShowController().viewProductwithMsg)

    //this is for my Account
    app.get('/myAccount', auth, notcouAge, myAccountController().index)
    app.post('/otp', auth, notcouAge, myAccountController().otp)
    app.post('/changeMyAcc', auth, notcouAge, myAccountController().changeMyAcc)

    //Add Product into cart
    app.get('/cart', customer, cartController().cart)
    app.post('/addToCart', customer, cartController().addToCart)
    app.post('/updateCart', customer, cartController().updateCart)
    app.post('/deleteCartPrd', customer, cartController().deleteCartPrd)

    //Buy Now
    app.post('/buyNow', customer, buyNowController().buyNow)
    app.post('/cust/myOrdersBuyNow', customer, buyNowController().placeOrderOfBuyNow)

    //Place Order from Cart
    app.get('/placeOrder', customer, orderController().index)
    app.get('/payBill/:add/:payMth', customer, orderController().payBill)
    app.get('/cust/myOrders', customer, orderController().showPlacedOrder)
    app.post('/cust/myOrders', customer, orderController().placeOrder)
    app.post('/payOnlineLater/:ordID/:feaInd/:prdID', customer, orderController().payOnlineLater)
    app.get('/orderDetails/:ordID/:feaInd/:prdID', customer, orderController().showPlacedOrderDetails)
    app.post('/cancelOrd/:ordID/:feaInd/:prdID', customer, orderController().cancelOrd)
    app.post('/returnOrd/:ordID/:feaInd/:prdID', customer, orderController().returnOrd)

    //Admin Section
    app.get('/adminSection/:msg', admin, adminSectionController().adminSection)

    //Courier Section
    app.get('/courierSection/:msg', courier, courierSectionController().courierSection)
    app.post('/signupCrAg', courier, courierSectionController().courierSectionSignupCrAg)
    app.post('/courierSection/deleteAge', courier, courierSectionController().deleteAge)
    app.post('/courierSection/updateAge', courier, courierSectionController().updateAge)

    //Courier Agent Dashboard
    app.get('/courieAgeDashBoard/:msg', CourierAgentDashboardController().getAgentDashboard);
    app.post('/couAgeLogin', CourierAgentDashboardController().couAgeLogin);
    app.post('/courieAgeDashBoard/cSt', CourierAgentDashboardController().couAgeChangeStatus);

    //Post Comments
    app.post('/shopSingleComment', postCommentController().shopSingleComment);

}

module.exports = initRoutes