const Product = require('../../../app/models/product');
const Store = require('../../../app/models/store');

function catProdShowController() {
    return {
        async showCategory(req, res) {
            const products = await Product.find({ category: req.params.category });
            // console.log(products);
            return res.render('customers/shop', { products });
        },
        async showSubCategory(req, res) {
            const products = await Product.find({ category: req.params.category, subcategory: req.params.subCategory });
            // console.log(products);
            return res.render('customers/shop', { products });
        },
        async viewProduct(req, res) {
            const product = await Product.find({ _id: req.params.prdID });
            const store = await Store.find({ _id: product[0]['storeId'] });
            // console.log(product);
            // console.log(store);
            return res.render('customers/shop-single', { product, store });
        }
    }
}

module.exports = catProdShowController;