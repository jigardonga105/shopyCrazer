const { json } = require("express")
const Product = require('../../../models/product');

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
            // console.log(cartProduct);

            return res.render('customers/cart', { cartProduct });
        },
        updateCart(req, res) {
            if (req.body.product) {
                let product = req.body.product;

                if (!req.session.cart) {
                    req.session.cart = {}
                }
                let cart = req.session.cart;

                if (req.user) {
                    console.log(req.user._id);
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
                        msg: 'You are not logged in'
                    })
                }

            } else {
                return res.json({
                    msg: 'We are facing some essuse. Please try again later 🙏'
                })
            }
        }
    }
}

module.exports = cartController