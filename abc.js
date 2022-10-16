const Product = require("../../../models/product");
const Store = require("../../../models/store");
const Users = require("../../../models/user");
const Comments = require("../../../models/comments");
const Orders = require("../../../models/order");
const fs = require('fs');

function postCommentController() {
    return {
        async shopSingleComment(req, res) {
            const { commTitle, commDesc, prdID, rating } = req.body;
            let rateHistory = req.user.rateHistory
            let isPrdAvil = false;

            if (commTitle && commDesc && prdID && rating && req.user) {
                if (rating === 0) {
                    rating = 5;
                }

                // ======================================================================================
                // ======================================================================================

                const updateCommData = async () => {
                    console.log('updateCommData called');
                    let obj = {
                        [prdID]: rating
                    }
                    req.user.rateHistory = { ...req.user.rateHistory, ...obj }

                    let prdData = await Product.findById({ _id: prdID }, { vote: 1, rating: 1, storeId:1, _id: 0 });
                    let vote = prdData.vote + 1;
                    let newRating = prdData.rating + parseInt(rating)
                    newRating = Math.round(newRating / vote);


                    await Product.updateOne({ _id: prdID }, { $set: { rating: newRating, vote } });
                    await Store.updateOne({ _id: prdData.storeId }, { $set: { rating: newRating } });
                }

                if (Object.keys(rateHistory).length === 0) {
                    console.log("When 'req.user.rateHistory' is empty");
                    updateCommData();
                } else {
                    console.log("When 'req.user.rateHistory' is already  present");
                    for (const id in rateHistory) {
                        if (id === prdID) {
                            isPrdAvil = true;
                        }
                    }
                }
                if (!isPrdAvil) {
                    console.log("Product not found");
                    updateCommData();
                } else {
                    console.log("Product available");
                    let prod = await Product.findById({ _id: prdID }, { vote: 1, storeId: 1 });
                    let allRatingsOfProduct = await Comments.find({ prdID }, { rating: 1 });
                    
                    let all = 0;
                    allRatingsOfProduct.map(obj => all = all + obj.rating)

                    let oldRating = req.user.rateHistory[prdID]
                    let newRating = all - oldRating;
                    newRating = newRating + parseInt(rating);
                    newRating = Math.round(newRating / prod.vote)

                    req.user.rateHistory = {
                        [prdID]: rating
                    }
                    await Product.updateOne({ _id: prdID }, { $set: { rating: newRating } });
                    await Store.updateOne({ _id: prod.storeId }, { $set: { rating: newRating } });
                }
                await Users.updateMany({ _id: req.user._id }, { $set: { rateHistory: req.user.rateHistory } });

                // ======================================================================================
                // ======================================================================================

                let productPictures = [];

                if (req.files.length > 0) {
                    productPictures = req.files.map((file) => {
                        return { img: file.filename };
                    });
                }

                const commentSaveFunc = async (req, res) => {
                    const product = await Product.find({ _id: prdID });
                    const store = await Store.find({ _id: product[0]['storeId'] });

                    let category = product[0].category;
                    let subcategory = product[0].subcategory;
                    const relatedPrds = await Product.find({ category, subcategory });

                    const comments = await Comments.find({ prdID: prdID });

                    let isOrdered = false;

                    const orders = await Orders.find({ customerId: req.user._id }, { items: 1, _id: 0 });
                    if (orders.length > 0) {
                        for (let i = 0; i < orders.length; i++) {
                            for (let id in orders[i].items) {
                                if (prdID == id) {
                                    isOrdered = true;
                                }
                            }
                        }
                    }
                    let commentedUsersIds = [];
                    for (const key in comments) {
                        const id = comments[key].userID;
                        commentedUsersIds.push(id);
                    }
                    let commentedUsers = await Users.find({ _id: commentedUsersIds }, { first_name: 1, last_name: 1 })
                    return res.render('customers/shop-single', { product, store, relatedPrds, comments, isOrdered, commentedUsers });
                }

                let comment;
                if (!isPrdAvil) {
                    // console.log("Product not found")
                    comment = new Comments({
                        title: commTitle,
                        desc: commDesc,
                        prdID: prdID,
                        userID: req.user._id,
                        image: productPictures,
                        rating
                    })

                    comment.save()
                        .then(async (result) => {
                            commentSaveFunc(req, res);
                        })
                        .catch(async (err) => {
                            commentSaveFunc(req, res);
                        })
                } else {
                    // console.log("Product available");
                    let imageSet = await Comments.find({ prdID, userID: req.user._id }).select({ image: 1, _id: 0 })
                    // console.log(imageSet[0].image.img);
                    
                    if (imageSet[0]) {
                        imageSet[0].image.map(image => {
                            // console.log(image.img);
                            fs.unlink(`public/uploadedImages/${image.img}`, (err, res) => {
                                if (err) {
                                    console.log(err);
                                }
                            })
                        })
                    }

                    await Comments.updateOne({ prdID, userID: req.user._id }, { $set: { 
                        title: commTitle,
                        desc: commDesc,
                        prdID: prdID,
                        userID: req.user._id,
                        image: productPictures,
                        rating
                     } })
                     commentSaveFunc(req, res);
                }

            } else {
                res.send('We are facing some essuse. Please try again later 🙏');
            }
        },
    }
}

module.exports = postCommentController