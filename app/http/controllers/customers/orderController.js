const User = require("../../../models/user");
const Product = require("../../../models/product");
const Order = require("../../../models/order");
const Store = require("../../../models/store");

function orderController() {
    return {
        async index(req, res) {
            res.render("customers/placeOrd");
        },
        async payBill(req, res) {
            let add = req.params.add;
            let payMth = req.params.payMth;
            let user = req.user;
            let cart = req.user.cart;
            var totalAmount = 0;
            var totalDisAmount = 0;

            let prdArr = [];
            for (const key in cart) {
                if (key == `custID_${req.user._id}_cart`) {
                    for (const itemKey in cart[key].items) {
                        prdArr.push(itemKey);
                    }
                }
            }
            const cartProduct = await Product.find({ _id: prdArr });
            prdArr.map((key) => {
                cartProduct.forEach((prd) => {
                    if (prd._id == key) {
                        let totalPrice = prd.price;
                        let discount = prd.discount;
                        let cartQty = 0;

                        let feature = cart[`custID_${user._id}_cart`].items[key].feature;
                        feature.map((item) => {
                            cartQty += item.qty
                        })

                        totalPrice = totalPrice * parseInt(cartQty);

                        let disPrice = (totalPrice / 100) * discount;
                        totalDisAmount = totalDisAmount + disPrice;

                        var finalPrice = totalPrice - disPrice;
                        totalAmount = totalAmount + finalPrice;
                    }
                });
            });
            res.render("customers/payBill", {
                add,
                payMth,
                totalAmount,
                totalDisAmount,
            });
        },
        async showPlacedOrder(req, res) {
            let userData = await User.findById({ _id: req.user._id });
            let custOrders = await Order.find({ customerId: req.user._id }, null, { sort: { createdAt: -1 } });
            let prdIDArr = [];
            let prdArr = [];
            let strIDArr = {};

            for (let i = 0; i < custOrders.length; i++) {
                for (const key in custOrders[i].items) {
                    if (prdIDArr.indexOf(key) === -1) {
                        prdIDArr.push(key);
                    }
                }
            }

            for (let i = 0; i < prdIDArr.length; i++) {
                let custProd = await Product.find({ _id: prdIDArr[i] });
                prdArr.push(custProd[0]);
                let res = await Store.findById({ _id: custProd[0].storeId });

                let obj = {
                    [custProd[0].storeId]: res.storename,
                };

                strIDArr = {...strIDArr, ...obj };
            }
            res.render("customers/custOrders", { userData, custOrders, prdArr, prdIDArr, strIDArr });
        },
        async placeOrder(req, res) {
            const {
                addressToDel,
                finalAmount,
                cardHoldName,
                cardNum,
                expMonth,
                cvv,
                finalPayMth,
            } = req.body;
            let address = JSON.parse(addressToDel);

            function savaOrderFunc(order, req, res) {
                order.save()
                    .then(async(order) => {
                        const result = await User.updateOne({ _id: req.user._id }, { $unset: { cart: "" } });
                        if (!result) {
                            res.redirect("/cart");
                        } else {
                            let userData = await User.findById({ _id: req.user._id });
                            let custOrders = await Order.find({ customerId: req.user._id },
                                null, { sort: { createdAt: -1 } }
                            );
                            let prdIDArr = [];
                            let prdArr = [];
                            let strIDArr = {};

                            for (let i = 0; i < custOrders.length; i++) {
                                for (const key in custOrders[i].items) {
                                    if (prdIDArr.indexOf(key) === -1) {
                                        prdIDArr.push(key);
                                    }
                                }
                            }

                            for (let i = 0; i < prdIDArr.length; i++) {
                                let custProd = await Product.find({ _id: prdIDArr[i] });
                                prdArr.push(custProd[0]);
                                let res = await Store.findById({ _id: custProd[0].storeId });

                                let obj = {
                                    [custProd[0].storeId]: res.storename,
                                };

                                strIDArr = {
                                    ...strIDArr,
                                    ...obj,
                                };
                            }

                            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
                            res.render("customers/custOrders", {
                                userData,
                                custOrders,
                                prdArr,
                                prdIDArr,
                                strIDArr,
                            });
                        }
                    })
                    .catch((err) => {
                        res.redirect("/cart");
                    });
            }

            if (finalPayMth) {
                //Add a new order
                const order = new Order({
                    customerId: req.user._id,
                    items: req.user.cart["custID_" + req.user._id + "_cart"].items,
                    phone: address["add-phone"],
                    address: JSON.stringify(address),
                    amount: parseInt(finalAmount),
                });

                savaOrderFunc(order, req, res);
            } else {
                //Add a new order
                const order = new Order({
                    customerId: req.user._id,
                    items: req.user.cart["custID_" + req.user._id + "_cart"].items,
                    phone: address["add-phone"],
                    address: JSON.stringify(address),
                    paymentType: "online",
                    paymentStatus: true,
                    amount: parseInt(finalAmount),
                });

                savaOrderFunc(order, req, res);
            }
            // res.render('customers/custOrders');
        },
        async payOnlineLater(req, res) {
            let result = await Order.updateOne({ _id: req.params.ordID }, { $set: { paymentStatus: true, paymentType: 'online' } });
            if (result) {
                res.redirect(`/orderDetails/${req.params.ordID}/${req.params.feaInd}/${req.params.prdID}`);
            } else {
                res.redirect("/");
            }

        },
        async showPlacedOrderDetails(req, res) {
            let order = await Order.findById({ _id: req.params.ordID });
            let product = await Product.findById({ _id: req.params.prdID });
            let feaInd = req.params.feaInd;

            let store = await Store.findById({ _id: product.storeId });
            let seller = store.storename;

            let otherPrdIDArr = [];
            let otherPrd = [];
            let strIDArr = {};

            for (const key in order.items) {
                otherPrdIDArr.push(key);
            }

            for (let i = 0; i < otherPrdIDArr.length; i++) {
                let result = await Product.findById({ _id: otherPrdIDArr[i] });
                otherPrd.push(result);
                let res = await Store.findById({ _id: result.storeId });

                let obj = {
                    [result.storeId]: res.storename,
                };

                strIDArr = {...strIDArr, ...obj };
            }


            res.render("customers/custOrdDetails", { order, product, feaInd, seller, otherPrd, strIDArr });
        },
        async cancelOrd(req, res) {
            let result = await Order.updateOne({ _id: req.params.ordID }, { $set: { status: 'cancelled' } });
            if (result) {
                res.redirect(`/orderDetails/${req.params.ordID}/${req.params.feaInd}/${req.params.prdID}`);
            } else {
                res.redirect("/cust/myOrders");
            }
        }
    };
}

module.exports = orderController;