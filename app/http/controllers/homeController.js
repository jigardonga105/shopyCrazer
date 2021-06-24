const Product = require('../../models/product');

function homeController() {
    return {
        async home(req, res) {
            const catData = await Product.find({}).select({ category: 1, subcategory: 1, _id: 0 })
            var catArr = [];
            for (let i = 0; i < catData.length; i++) {
                let cat = catData[i].category;
                let subcat = catData[i].subcategory;
                catArr.push({
                    [cat]: subcat
                });
            }
            catArr = [...new Set(catArr)]; // Remove Duplicates from the Array
            // console.log(catArr);

            return res.render('home')
        },
        async about(req, res) {
            return res.render('admin/about')
        },
        async contact(req, res) {
            return res.render('customers/contact')
        },
        async shop(req, res) {
            return res.render('customers/shop')
        },
        async shopSingle(req, res) {
            return res.render('customers/shop-single')
        }
    }
}

module.exports = homeController