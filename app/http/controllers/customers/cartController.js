const { json } = require("express")
const Product = require('../../../models/product');
const Store = require('../../../models/store');

function cartController() {
    return {
        async cart(req, res) {

            let cart = req.session.cart;

            let prdArr = [];
            for (const key in cart) {
                if (key == `custID_${req.user._id}_cart`) {
                    for (const itemKey in cart[key].items) {
                        prdArr.push(itemKey);
                    }
                }
            }
            const cartProduct = await Product.find({ _id: prdArr });
            let strNameArr = [];
            for (const key in cartProduct) {
                const storeName = await Store.findById({ _id: cartProduct[key].storeId }).select({ storename: 1, _id: 0 })
                strNameArr.push(storeName['storename']);
            }
            return res.render('customers/cart', { cartProduct, strNameArr });
        },
        addToCart(req, res) {
            if (req.body.product) {
                let product = req.body.product;

                if (!req.session.cart) {
                    req.session.cart = {}
                }
                let cart = req.session.cart;

                if (req.user) {

                    if (req.user.role == 'customer') {
                        // console.log(req.user._id);
                        //Check if our current customer's cart is already exists
                        if (!cart['custID_' + req.user._id + '_cart']) {
                            cart['custID_' + req.user._id + '_cart'] = {
                                items: {},
                                totalQty: 0,
                                totalPrice: 0
                            }
                        }

                        // Check if item does not exist in cart 
                        if (!cart['custID_' + req.user._id + '_cart'].items[product._id]) {

                            cart['custID_' + req.user._id + '_cart'].items[product._id] = {
                                item: product._id,
                                qty: 1
                            }
                            cart['custID_' + req.user._id + '_cart'].totalQty = cart['custID_' + req.user._id + '_cart'].totalQty + 1
                            cart['custID_' + req.user._id + '_cart'].totalPrice = cart['custID_' + req.user._id + '_cart'].totalPrice + product.price

                        } else {

                            cart['custID_' + req.user._id + '_cart'].items[product._id].qty = cart['custID_' + req.user._id + '_cart'].items[product._id].qty + 1
                            cart['custID_' + req.user._id + '_cart'].totalQty = cart['custID_' + req.user._id + '_cart'].totalQty + 1
                            cart['custID_' + req.user._id + '_cart'].totalPrice = cart['custID_' + req.user._id + '_cart'].totalPrice + product.price

                        }

                        return res.json({
                            totalQty: req.session.cart['custID_' + req.user._id + '_cart'].totalQty
                        })
                    } else {
                        return res.json({
                            msg: 'Currently you are not Customer.'
                        })
                    }

                } else {
                    return res.json({
                        msg: 'You are not logged in'
                    })
                }

            } else {
                return res.json({
                    msg: 'We are facing some essuse. Please try again later 🙏'
                })
            }
        },
        updateCart(req, res){
            if(req.body.plus){

                let cart = req.session.cart;
                let qty;
                let totalQty;
                let totalPrice;

                for (const key in cart) {
                    if (key == `custID_${req.user._id}_cart`) {
                        for (const itemKey in cart[key].items) {

                            if(itemKey == req.body.prdID){
                                cart[key].items[itemKey].qty = cart[key].items[itemKey].qty + 1
                                qty = cart[key].items[itemKey].qty
                            }
                        }
                        cart['custID_' + req.user._id + '_cart'].totalQty = cart['custID_' + req.user._id + '_cart'].totalQty + 1
                        totalQty = cart['custID_' + req.user._id + '_cart'].totalQty

                        cart['custID_' + req.user._id + '_cart'].totalPrice = cart['custID_' + req.user._id + '_cart'].totalPrice + req.body.prdPrice
                        totalPrice = cart['custID_' + req.user._id + '_cart'].totalPrice
                    }
                }
                return res.json({
                    qty,
                    totalQty,
                    totalPrice
                })
            }
            if(req.body.min){
                let cart = req.session.cart;
                let qty;
                let totalQty;
                let totalPrice;

                for (const key in cart) {
                    if (key == `custID_${req.user._id}_cart`) {
                        for (const itemKey in cart[key].items) {

                            if(itemKey == req.body.prdID){
                                cart[key].items[itemKey].qty = cart[key].items[itemKey].qty - 1
                                qty = cart[key].items[itemKey].qty
                            }
                        }
                        cart['custID_' + req.user._id + '_cart'].totalQty = cart['custID_' + req.user._id + '_cart'].totalQty - 1
                        totalQty = cart['custID_' + req.user._id + '_cart'].totalQty

                        cart['custID_' + req.user._id + '_cart'].totalPrice = cart['custID_' + req.user._id + '_cart'].totalPrice - req.body.prdPrice
                        totalPrice = cart['custID_' + req.user._id + '_cart'].totalPrice
                    }
                }
                return res.json({
                    qty,
                    totalQty,
                    totalPrice
                })
            }
        }
    }
}

module.exports = cartController