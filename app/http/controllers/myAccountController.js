const User = require('../../models/user');
const otpGenerator = require('otp-generator')
const fs = require('fs');

const accountSid = 'AC910b3239a6b235851c5ad7a88a93954c';
const authToken = 'c18d7172988690cda3471e12fad0d757';
const client = require('twilio')(accountSid, authToken);

function myAccountController() {
    return {
        async index(req, res) {
            // const user = User.findById({ _id: req.params.userID });

            return res.render('myAcc');
        },
        async otp(req, res) {

            // console.log(req.body.phoneNumber);
            let phoneNumber = req.body.phoneNumber;

            let otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
            // console.log(otp);

            client.messages
                .create({
                    body: `${otp} is your One Time Password for change Phone Number in shopyCrazer.`,
                    from: '+17208939563',
                    to: '+919624233580'
                        // to: '+91' + phoneNumber //Trial accounts cannot send messages to unverified numbers;
                        //verify  at twilio.com/user/account/phone-numbers/verified, or purchase a Twilio number to send messages to unverified numbers.
                })
                .then(message => {
                    // console.log(message.sid);
                    res.send(otp);
                })
                .catch(err => {
                    console.log(err);
                    res.send('We are facing some essuse. Please try again later 🙏');
                });
        },
        async changeMyAcc(req, res) {
            function sendErr(res) {
                res.send('We are facing some essuse. Please try again later 🙏');
            }


            if (req.body.fname && req.body.lname && req.body.gender) {

                const result = await User.updateOne({ _id: req.body.userID }, { $set: { first_name: req.body.fname, last_name: req.body.lname, gender: req.body.gender } })
                    // console.log(result);
                if (result) {
                    const user = await User.findById({ _id: req.body.userID })
                    res.send(user);
                } else {
                    sendErr(res)
                }
            }
            if (req.body.email) {

                const result = await User.updateOne({ _id: req.body.userID }, { $set: { email: req.body.email } })
                    // console.log(result);
                if (result) {
                    const user = await User.findById({ _id: req.body.userID })
                    res.send(user);
                } else {
                    sendErr(res)
                }
            }
            if (req.body.phoneNumber) {
                let phoneNumber = req.body.phoneNumber;
                let userID = req.body.userID;

                const result = await User.updateOne({ _id: userID }, { $set: { phone: phoneNumber } })
                    // console.log(result);
                if (result) {
                    const user = await User.findById({ _id: userID })
                    res.send(user);
                } else {
                    sendErr(res)
                }
            }
            if (req.files) {
                let productPictures = [];

                if (req.files.length > 0) {
                    productPictures = req.files.map((file) => {
                        return { img: file.filename };
                    });
                }

                const user = await User.findById({ _id: req.body.userID });
                for (let i = 0; i < user.image.length; i++) {
                    // console.log(user.image[i].img);
                    let img = user.image[i].img;
                    fs.unlink(`public/uploadedImages/${img}`, (err, res) => {
                        if (err) {
                            console.log(err);
                        }
                    })
                }

                const result = await User.updateOne({ _id: req.body.userID }, { $set: { image: productPictures } })
                if (result) {
                    res.redirect(`/myAccount`)
                } else {
                    res.redirect('/myAccount?unsuccessfull')
                }
            }
            if (req.body.address) {
                // console.log(req.body.address);
                const result = await User.updateOne({ _id: req.body.userID }, { $push: { address: req.body.address } });
                // console.log(result);
                if (result) {
                    const user = await User.findById({ _id: req.body.userID })
                    res.send(user);
                } else {
                    sendErr(res)
                }
            }
            if (req.body.editAddressData) {

                let userID = req.body.userID
                let address = req.body.editAddressData
                let editKey = req.body.editKey

                const result = await User.updateOne({ _id: userID }, {
                    $set: {
                        [`address.${editKey}`]: address
                    }
                });
                if (result) {
                    const user = await User.findById({ _id: req.body.userID });
                    res.send(user);
                } else {
                    sendErr(res)
                }

            }
            if (req.body.delAddress) {
                let address = req.body.delAddress;
                const result = await User.updateOne({ _id: req.body.userID }, {
                    $pull: {
                        address: {
                            "add-name": address['add-name'],
                            "add-phone": address['add-phone'],
                            "add-pin": address['add-pin'],
                            "add-locality": address['add-locality'],
                            "add-area&street": address['add-area&street'],
                            "add-city": address['add-city'],
                            "add-state": address['add-state'],
                            "add-type": address['add-type'],
                        }
                    }
                });
                if (result) {
                    const user = await User.findById({ _id: req.body.userID })
                    res.send(user);
                } else {
                    sendErr(res)
                }
            }
        }
    }
}

module.exports = myAccountController;