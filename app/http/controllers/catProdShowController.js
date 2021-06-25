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

            let category = product[0].category;
            let subcategory = product[0].subcategory;
            const relatedPrds = await Product.find({ category, subcategory });

            // console.log(product);
            // console.log(store);
            // console.log(relatedPrd);
            return res.render('customers/shop-single', { product, store, relatedPrds });
        }
    }
}

module.exports = catProdShowController;