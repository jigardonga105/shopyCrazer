import axios from "axios";
import validator from "validator";
import otpGenerator from "otp-generator";


export function myAcc() {

    let user = document.getElementById('user').value;
    user = JSON.parse(user);
    var userID = user._id;
    var oldEmail = user.email;
    var oldPhoneNum = user.phone;

    // ========================================================================
    // ========================================================================
    //General Functions
    function putDataInField() {
        document.getElementById("fname").value = user.first_name;
        document.getElementById("lname").value = user.last_name;
        document.getElementById("email").value = user.email;
        document.getElementById("phone").value = user.phone;


        if (user.gender) {
            if (user.gender == 'Male') {
                document.getElementById("inlineRadio1").checked = true;
            } else if (user.gender == 'Female') {
                document.getElementById("inlineRadio2").checked = true;
            }
        }
    }
    putDataInField();

    function showErrField(str, inputField) {
        let p = document.createElement("p");
        p.setAttribute('class', 'show-err');
        p.innerHTML = str;
        inputField.parentElement.insertBefore(p, inputField.previousSibling);

        setTimeout(() => {
            document.querySelector('.show-err').remove();
        }, 3000);
    }

    function showMSG(span, color) {
        let p = document.createElement("p");
        p.setAttribute('class', 'showMSG-p');
        if (color == 'red') {
            p.innerHTML = 'Something went wrong!'
        } else {
            p.innerHTML = 'Updated ✔';
        }

        span.parentNode.insertBefore(p, span.nextSibling);
        document.querySelector('.showMSG-p').style.display = 'inline-block';
        document.querySelector('.showMSG-p').style.color = color;

        setTimeout(() => {
            document.querySelector('.showMSG-p').remove();
        }, 3000);
    }

    function showErrMSG(data) {
        if (data == 'We are facing some essuse. Please try again later 🙏') {
            showErrField('We are facing some essuse. Please try again later 🙏');
            errCome();
        } else {
            user = data;
        }
    }

    function errCome() {
        document.getElementById("phone").style.display = "inline-block";
        document.getElementById("phone-otp-btn").style.display = "inline-block";
        document.getElementById("phoneOtp").style.display = "none";
        document.getElementById("phone-save-btn").style.display = "none";
    }

    function errFree() {
        document.getElementById("phone").style.display = "inline-block";
        document.getElementById("phone-otp-btn").style.display = "none";
        document.getElementById("phoneOtp").style.display = "inline-block";
        document.getElementById("phone-save-btn").style.display = "inline-block";
    }

    function sendEmail(email, subject, body) {
        Email.send({
            Host: "smtp.gmail.com",
            Username: "zayshop2021@gmail.com",
            Password: "Zayshop@2021-22",
            To: email,
            From: "zayshop2021@gmail.com",
            Subject: subject,
            Body: body,
        })
    }
    // ========================================================================
    // ========================================================================
    document.getElementById("per-info-save-btn").style.display = "none";
    let perInfoASpan = document.querySelector('#per-info-a-span');

    perInfoASpan.addEventListener('click', () => {
        if (perInfoASpan.innerHTML == 'Edit') {
            perInfoASpan.innerHTML = 'Cancel';

            document.getElementById("fname").classList.remove('cursor-not-allowed');
            document.getElementById("fname").classList.remove('text-color-gray');
            document.getElementById("fname").removeAttribute('disabled', '');

            document.getElementById("lname").classList.remove('cursor-not-allowed');
            document.getElementById("lname").classList.remove('text-color-gray');
            document.getElementById("lname").removeAttribute('disabled', '');

            document.getElementById("inlineRadio1").classList.remove('cursor-not-allowed');
            document.getElementById("inlineRadio1").removeAttribute('disabled', '');
            document.getElementById("inlineRadio2").classList.remove('cursor-not-allowed');
            document.getElementById("inlineRadio2").removeAttribute('disabled', '');

            document.getElementById("per-info-save-btn").style.display = "inline-block";
        } else {
            perInfoASpan.innerHTML = 'Edit';

            document.getElementById("fname").classList.add('cursor-not-allowed');
            document.getElementById("fname").classList.add('text-color-gray');
            document.getElementById("fname").setAttribute('disabled', '');

            document.getElementById("lname").classList.add('cursor-not-allowed');
            document.getElementById("lname").classList.add('text-color-gray');
            document.getElementById("lname").setAttribute('disabled', '');

            document.getElementById("inlineRadio1").classList.add('cursor-not-allowed');
            document.getElementById("inlineRadio1").setAttribute('disabled', '');
            document.getElementById("inlineRadio2").classList.add('cursor-not-allowed');
            document.getElementById("inlineRadio2").setAttribute('disabled', '');

            document.getElementById("per-info-save-btn").style.display = "none";
        }
    })

    let emailInp = document.getElementById("email");
    let emailVarBtn = document.getElementById('email-var-btn');
    let emailVarDiv = document.getElementById('email-var-div');
    emailVarBtn.style.display = 'none';
    emailVarDiv.style.display = 'none';

    let emailSpan = document.querySelector('#email-span');
    emailSpan.addEventListener('click', () => {
        if (emailSpan.innerHTML == 'Edit') {
            emailSpan.innerHTML = 'Cancel';

            emailInp.classList.remove('cursor-not-allowed');
            emailInp.classList.remove('text-color-gray');
            emailInp.removeAttribute('disabled', '');

            emailVarBtn.style.display = 'inline-block';
        } else {
            emailSpan.innerHTML = 'Edit';

            emailInp.classList.add('cursor-not-allowed');
            emailInp.classList.add('text-color-gray');
            emailInp.setAttribute('disabled', '');

            emailVarBtn.style.display = 'none';
            emailVarDiv.style.display = 'none';
        }
    })

    document.getElementById("phone-save-btn").style.display = "none";
    document.getElementById("phoneOtp").style.display = "none";
    document.getElementById("phone-otp-btn").style.display = "none";

    let phoneSpan = document.querySelector('#phone-span');

    phoneSpan.addEventListener('click', () => {
        if (phoneSpan.innerHTML == 'Edit') {
            phoneSpan.innerHTML = 'Cancel';

            document.getElementById("phone").classList.remove('cursor-not-allowed');
            document.getElementById("phone").classList.remove('text-color-gray');
            document.getElementById("phone").removeAttribute('disabled', '');

            document.getElementById("phone-otp-btn").style.display = "inline-block";
        } else {
            phoneSpan.innerHTML = 'Edit';

            document.getElementById("phone").classList.add('cursor-not-allowed');
            document.getElementById("phone").classList.add('text-color-gray');

            document.getElementById("phone").setAttribute('disabled', '');

            document.getElementById("phone-otp-btn").style.display = "none";

            document.getElementById("phoneOtp").style.display = "none";
            document.getElementById("phone-save-btn").style.display = "none";

        }
    })

    //==========================================================================
    //Name and Gender
    //==========================================================================
    let genderInp = document.getElementsByName('gender');
    let gender;
    for (let i = 0; i < genderInp.length; i++) {
        genderInp[i].addEventListener('click', () => {
            gender = genderInp[i].value;
        })
    }

    document.getElementById('per-info-save-btn').addEventListener('click', () => {
        let fnameInp = document.getElementById('fname');
        let lnameInp = document.getElementById('lname');

        let fname = fnameInp.value;
        let lname = lnameInp.value;
        if (gender == undefined) {
            gender = 'Male';
        }

        axios.post('/changeMyAcc', { userID, fname, lname, gender })
            .then((response) => {
                showErrMSG(response.data)

                document.querySelector('#per-info-a-span').click();
                putDataInField();
                showMSG(document.getElementById('per-info-a-span'), '#4ab74a');
            })
            .catch((err) => {
                console.log(err);
                showMSG(document.getElementById('per-info-a-span'), 'red');
            })
    })

    //==================================================================================
    //Email
    //==================================================================================

    emailVarBtn.addEventListener('click', () => {
        if (emailInp.value == '') {
            showErrField('Email field should not be Blank!', emailInp);

        } else if (emailInp.value == oldEmail) {
            showErrField('Please change your Email!', emailInp);
        } else {
            let email = emailInp.value

            const isEmail = validator.isEmail(email)
            if (!isEmail) {
                showErrField('Please enter valid Email!', emailInp);
            } else {

                let otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                let subject = 'Verify Your Email Address';
                let body = `<div>
                                <span>
                                    <h1>Your varification code is: ${otp}</h1>
                                    <br>
                                    <h3>for update email address in Zay Shop.</h3>
                                </span>
                            </div>`;

                sendEmail(email, subject, body);
                emailVarDiv.style.display = 'block';

                document.getElementById("email-pass-save-btn").addEventListener("click", () => {
                    let varCodeInp = document.getElementById('varCode');
                    if (varCodeInp.value == otp) {
                        axios.post('/changeMyAcc', { userID, email })
                            .then((response) => {
                                showErrMSG(response.data)

                                document.querySelector('#email-span').click();
                                putDataInField();
                                showMSG(document.getElementById('email-span'), '#4ab74a');

                                let subject = 'Successfully changed your email address';
                                let body = `<div>
                                                <img src="/img/apple-icon.png" style="margin: auto;">
                                                <span>
                                                    <h1>You have successfully changed your email address</h1>
                                                    <br>
                                                    <h2>Your new email address is: ${user.email}</h2>
                                                    <br>
                                                    <h3>Thank you for using Zay Shop.</h3>
                                                </span>
                                            </div>`;

                                sendEmail(user.email, subject, body);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                });
            }
        }
    })

    //==================================================================================
    //Phone Number
    //==================================================================================

    var otp;
    document.getElementById("phone-otp-btn").addEventListener("click", () => {
        document.getElementById("phone").style.display = "inline-block";
        document.getElementById("phoneOtp").style.display = "inline-block";
        document.getElementById("phone-otp-btn").style.display = "none";
        document.getElementById("phone-save-btn").style.display = "inline-block";

        let phoneInp = document.getElementById("phone");
        let phoneErr = document.getElementById("phone-err");
        phoneErr.style.display = "none";



        if (phoneInp.value == '') {
            showErrField('Contact Number field should not be Blank!', phoneInp);
            errCome();

        } else if (phoneInp.value.length != 10) {
            showErrField('Contact Number length should be 10!', phoneInp);
            errCome();

        } else if (phoneInp.value == oldPhoneNum) {
            showErrField('Please change your Contact Number!', phoneInp);
            errCome();

        } else {
            errFree();
            let phoneNumber = phoneInp.value;
            axios.post(`/otp`, { phoneNumber })
                .then((response) => {
                    // console.log(response.data);
                    if (response.data == 'We are facing some essuse. Please try again later 🙏') {
                        showErrField('We are facing some essuse. Please try again later 🙏', phoneInp);
                        errCome();
                    } else {
                        otp = response.data;
                    }
                }, (error) => {
                    console.log(error);
                    showErrField(error, phoneInp);
                });
        }
    })

    document.getElementById("phone-save-btn").addEventListener("click", () => {

        const inputs = document.querySelectorAll('#otp > *[id]');
        let otpArr = [];
        for (let i = 0; i < inputs.length; i++) {
            otpArr.push(inputs[i].value);
        }
        let userEnterOTP = otpArr.join('');
        // console.log(userEnterOTP);

        if (otp == userEnterOTP) {
            // console.log('matched');
            let phoneInp = document.getElementById("phone");

            let phoneNumber = phoneInp.value;
            axios.post(`/changeMyAcc`, { phoneNumber, userID })
                .then((response) => {

                    showErrMSG(response.data)

                    document.querySelector('#phone-span').click();
                    putDataInField();
                    showMSG(document.getElementById('phone-span'), '#4ab74a');

                    let subject = 'Successfully changed your Contact Number';
                    let body = `<div>
                                    <img src="/img/apple-icon.png" style="margin: auto;">
                                    <span>
                                        <h1>You have successfully changed your Contact Number</h1>
                                        <br>
                                        <h2>Your new Contact Number is: ${user.phone}</h2>
                                        <br>
                                        <h3>Thank you for using Zay Shop.</h3>
                                    </span>
                                </div>`;

                    sendEmail(user.email, subject, body);

                }, (error) => {
                    console.log(error);
                    showMSG(document.getElementById('phone-span'), 'red');
                });
        } else {
            showErrField('Please Enter valid OTP!');
        }
    })

    //==================================================================================
    //==================================================================================

}