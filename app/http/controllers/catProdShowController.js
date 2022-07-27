const Product = require('../../../app/models/product');
const Store = require('../../../app/models/store');

function catProdShowController() {
    return {
        async showCategory(req, res) {
            const products = await Product.find({ category: req.params.category });

            if (req.session.courierAgents) {
                var courierAgents = req.session.courierAgents;
                return res.render('customers/shop', { cAg: true, courierAgents, products });
            } else {
                return res.render('customers/shop', { cAg: false, products });
            }
        },
        async showSubCategory(req, res) {
            const products = await Product.find({ category: req.params.category, subcategory: req.params.subCategory });

            if (req.session.courierAgents) {
                var courierAgents = req.session.courierAgents;
                return res.render('customers/shop', { cAg: true, courierAgents, products });
            } else {
                return res.render('customers/shop', { cAg: false, products });
            }
        },
        async viewProduct(req, res) {
            const product = await Product.find({ _id: req.params.prdID });
            const store = await Store.find({ _id: product[0]['storeId'] });

            let category = product[0].category;
            let subcategory = product[0].subcategory;
            const relatedPrds = await Product.find({ category, subcategory });

            if (req.session.courierAgents) {
                var courierAgents = req.session.courierAgents;
                return res.render('customers/shop-single', { cAg: true, courierAgents, product, store, relatedPrds });
            } else {
                return res.render('customers/shop', { cAg: false, store, relatedPrds });
            }
        }
    }
}

module.exports = catProdShowController;