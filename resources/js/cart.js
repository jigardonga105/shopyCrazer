import axios from "axios";
import Noty from "noty";

export function cart() {
    let addToCartBtn = document.getElementsByClassName("addToCartBtn");
    let cartCounter = document.getElementById("cartCounter");

    function cartUpdateNoty(msg, type) {
        new Noty({
            type: type,
            timeout: 3000,
            text: msg,
            progressBar: false,
        }).show();
    }

    function updateCart(product) {
        axios
            .post("/addToCart", { product })
            .then((response) => {
                if (response.data.msg) {
                    let msg = response.data.msg;
                    if (msg == "You are not logged in") {
                        cartUpdateNoty(msg, "information");
                    } else if (
                        msg == "We are facing some essuse. Please try again later 🙏"
                    ) {
                        cartUpdateNoty(msg, "information");
                    } else if (msg == "Currently you are not Customer.") {
                        cartUpdateNoty(msg, "information");
                    }
                } else if (response.data.totalQty) {
                    let totalQty = response.data.totalQty;

                    // cartCounter.innerText = '';
                    cartCounter.innerText = totalQty;

                    cartUpdateNoty("Item added to cart", "success");
                }
            })
            .catch((err) => {
                cartUpdateNoty("Something went wrong", "error");
            });
    }

    if (addToCartBtn) {
        for (let i = 0; i < addToCartBtn.length; i++) {
            let btn = addToCartBtn[i];

            btn.addEventListener("click", (e) => {
                let product = JSON.parse(btn.dataset.product);
                // console.log(product);
                updateCart(product);
            });
        }
    }

    //==================================================================
    //==================================================================
    //==================================================================
    function forRightSideDiv(cartTotalQty, cartTotalPrice, cartTotalDiscount){
        let cartRightDiv = document.getElementById('cartRightDiv');

        let cartRightDivStr = `<div>
                                <div class="p-3 border-b">
                                    <span class="text-muted">PRICE DETAILS</span>
                                </div>

                                <div class="m-3 border-b-4 border-dotted">
                                    <div class="my-3">
                                        <span>Price (${cartTotalQty} items)</span>
                                        <span class="float-right">₹${cartTotalPrice}</span>
                                    </div>
                                    <div class="my-3">
                                        <span>Discount</span>
                                        <span class="float-right text-green-600">- ₹${cartTotalDiscount}</span>
                                    </div>
                                    <div class="my-3">
                                        <span>Delivery Charges</span>
                                        <span class="float-right text-green-600">Free</span>
                                    </div>
                                </div>

                                <div class="m-3 border-b-4 border-dotted">
                                    <div class="my-3">
                                        <span>Total Amount</span>
                                        <span class="float-right font-bold">₹${ cartTotalPrice - cartTotalDiscount}</span>
                                    </div>
                                </div>

                                <div class="m-3">
                                    <div class="my-3">
                                        <span class="text-green-700 font-bold">You will save ₹${cartTotalDiscount} on this order</span>
                                    </div>
                                </div>
                            </div>`;
        cartRightDiv.innerHTML = cartRightDivStr;
    }

    function fillDataCart(user, cartData, prdData, strNameArr, day, month, dateToday) {
        let allCartProduct = document.getElementById('allCartProduct');
        allCartProduct.innerHTML = '';

        let cartTotalQty = cartData['custID_' + user['_id'] + '_cart'].totalQty;
        let cartTotalPrice = cartData['custID_' + user['_id'] + '_cart'].totalPrice;
        let cartTotalDiscount = 0;

        document.getElementById('itemLength').innerHTML = `My Cart(${cartTotalQty})`;

        prdData.map((prd, index) => {
            let priceAftDisc = prd.price - ((prd.price / 100) * prd.discount);
            priceAftDisc = Math.round(priceAftDisc);

            let prdService;
            prd.service.map((service) => {
                if (service.search("return") >= 0) {
                    prdService = service;
                } else if (service.search("Return") >= 0) {
                    prdService = service;
                } else if (service.search("Replacement") >= 0) {
                    prdService = service;
                } else if (service.search("replacement") >= 0) {
                    prdService = service;
                }
            })

            let prdStr = `<div class="grid grid-cols-6 my-4 pt-3 border-t">
                            <div class="flex flex-col col-span-1">
                                <div class="h-24 overflow-hidden mx-auto">
                                    <img class="w-40 cursor-pointer" src="/uploadedImages/${prd.image[0].img}" onclick="window.location.href = '/productview/${prd._id}'" alt="Mac">
                                </div>
                                <div class="mt-2 mx-auto">
                                    <span id="cartMinBtn" data-prdID="${prd._id}" class="cartPlusMin rounded-full px-2 py-1 cursor-pointer focus:outline-none">-</span>
                                    <span id="cartItemLen" class="${prd._id}_qty bg-gray-100 px-4 py-2">3</span>
                                    <span id="cartPlusBtn" data-prdID="${prd._id}" class="cartPlusMin rounded-full px-2 py-1 cursor-pointer focus:outline-none">+</span>
                                </div>
                            </div>

                            <div class="col-span-3 px-2">
                                <div>
                                    <div>
                                        <span class="text-base font-bold cursor-pointer" onclick="window.location.href = '/productview/${prd._id}'">${prd.name.substring(0, 45)}${prd.name.length > 45 ? '...' : ''}</span>
                                    </div>
                                    <div>
                                        <span class="text-base text-muted">Seller: ${strNameArr[index]}</span>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <span class="font-bold">₹${priceAftDisc}</span>
                                    <span class="line-through text-base text-muted ml-2">₹${prd.price}</span>
                                    <span class="text-green-800 font-bold text-sm ml-2">${prd.discount}% off</span>
                                    <span class="text-green-800 font-bold text-sm ml-2">
                                        ${Object.keys(prd.offer[0]).length} offer available
                                        <i id="cartOfferIcon" class="fas fa-info-circle cursor-pointer"></i>
                                        <div id="cartOfferDiv" class="cartOfferDiv w-72 border absolute z-10 bg-white rounded">
                                            <div class="text-12 p-3">
                                                <div class="m-1 border-b-4 border-dotted">
                                                    <div class="my-1">
                                                        <span class="text-muted">MRP</span>
                                                        <span class="float-right line-through">₹${prd.price}</span>
                                                    </div>
                                                    <div class="my-1">
                                                        <span class="text-muted">Selling Price</span>
                                                        <span class="float-right">₹${priceAftDisc}</span>
                                                    </div>
                                                    <div class="my-1">
                                                        <span class="text-muted">Extra Discount</span>
                                                        <span class="float-right text-green-600">${prd.extraDiscount ? prd.extraDiscount : 0}%</span>
                                                    </div>
                                                    <div class="my-1">
                                                        <span class="text-muted">Special Price</span>
                                                        <span class="float-right">₹${priceAftDisc}</span>
                                                    </div>
                                                </div>

                                                <div class="m-1 border-b-4 border-dotted">
                                                    <div class="my-1">
                                                        <span class="text-muted">Total</span>
                                                        <span class="float-right font-bold">₹${priceAftDisc}</span>
                                                    </div>
                                                </div>

                                                <div class="m-1">
                                                    <div class="my-1">
                                                        <span class="text-green-700 font-bold">Save more
                                                            with these offers</span>
                                                    </div>
                                                    <div class="my-1">
                                                        <ul id="cartOfferUl" class="pl-0">
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </span>
                                </div>
                                <div class="mt-4 float-right mr-16">
                                    <button class="shadow px-2 py-1 rounded focus:outline-none">Remove</button>
                                </div>
                            </div>

                            <div class="col-span-2">
                                <div>
                                    <span class="text-base">
                                        Delivery by ${day} ${month} ${dateToday} |
                                        <span class="text-green-900">Free</span>
                                        <span class="line-through">₹40</span>
                                    </span>
                                </div>
                                <div>
                                    <span class="text-muted text-sm">${prdService == undefined ? 'No Return Policy' : prdService}</span>
                                </div>
                            </div>
                            </div>`;

            allCartProduct.innerHTML += prdStr;

            let cartItems = cartData['custID_' + user._id + '_cart'].items;
            let prdIdQty = document.getElementsByClassName(`${prd._id}_qty`)[0];
            prdIdQty.innerHTML = cartItems[`${prd._id}`].qty;

            cartTotalDiscount = cartTotalDiscount + Math.round(((prd.price / 100) * prd.discount));

        })
        let cartOfferUl = document.querySelectorAll('#cartOfferUl');

        for (let i = 0; i < cartOfferUl.length; i++) {

            for (let offer in prdData[i].offer[0]) {

                for (let key in prdData[i].offer[0][offer]) {

                    let li = document.createElement("li");
                    li.classList.add('m-1', 'list-disc')
                    li.innerHTML = `${prdData[i].offer[0][offer][key]}`

                    cartOfferUl[i].appendChild(li);
                }
            }
        }



        forRightSideDiv(cartTotalQty, cartTotalPrice, cartTotalDiscount)
    }


    let cartDataInp = document.getElementById('cartData');
    let prdDataInp = document.getElementById('prdData');
    let strNameArrInp = document.getElementById('strNameArr');

    let user;
    let cartData;
    let prdData;
    let strNameArr;
    let date;
    let day;
    let month;
    let dateToday;

    if (cartDataInp) {
        user = JSON.parse(cartDataInp.dataset.user);
        cartData = JSON.parse(cartDataInp.value);
        prdData = JSON.parse(prdDataInp.value);
        strNameArr = JSON.parse(strNameArrInp.value);

        if (prdData.length > 5) {
            date = new Date(new Date().getTime() + (3 * 24 * 60 * 60 * 1000));
        } else if (prdData.length > 2) {
            date = new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000));
        } else if (prdData.length > 0) {
            date = new Date(new Date().getTime() + (8 * 24 * 60 * 60 * 1000));
        }
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        day = days[date.getDay()];
        month = months[date.getMonth()];
        dateToday = date.getDate();

        fillDataCart(user, cartData, prdData, strNameArr, day, month, dateToday);
    }

    // =====================================================================================
    // =====================================================================================
    // =====================================================================================

    //counter of cart plus-min button
    function cartPlusMinFunc() {
        let cartPlusBtn = document.querySelectorAll('#cartPlusBtn');
        let cartMinBtn = document.querySelectorAll('#cartMinBtn');
        let cartItemLen = document.querySelectorAll('#cartItemLen');

        function hideMinBtn(cartItemLen, cartPlusBtn, cartMinBtn){
            if (cartItemLen.innerHTML < 4) {
                cartPlusBtn.classList.remove("hidden");
            }else{
                cartPlusBtn.classList.add("hidden");
            }

            if (cartItemLen.innerHTML == 1) {
                cartMinBtn.classList.add("hidden");
            }else{
                cartMinBtn.classList.remove("hidden");
            }
        }

        //cartPlusBtn:
        for (let i = 0; i < cartPlusBtn.length; i++) {

            hideMinBtn(cartItemLen[i], cartPlusBtn[i], cartMinBtn[i]);

            cartPlusBtn[i].addEventListener("click", () => {

                let prdID = cartPlusBtn[i].dataset.prdid;
                let plus = true;

                axios.post("/updateCart", { prdID, plus })
                    .then((response) => {
                        if (response.data.qty) {
                            cartItemLen[i].innerHTML = response.data.qty;
                            hideMinBtn(cartItemLen[i], cartPlusBtn[i], cartMinBtn[i]);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        }

        //cartMinBtn:
        for (let i = 0; i < cartMinBtn.length; i++) {

            hideMinBtn(cartItemLen[i], cartPlusBtn[i], cartMinBtn[i]);

            cartMinBtn[i].addEventListener("click", () => {

                let prdID = cartMinBtn[i].dataset.prdid;
                let min = true;

                axios.post("/updateCart", { prdID, min })
                    .then((response) => {
                        if (response.data.qty) {
                            cartItemLen[i].innerHTML = response.data.qty;
                            hideMinBtn(cartItemLen[i], cartPlusBtn[i], cartMinBtn[i]);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        }
    }

    cartPlusMinFunc();

    //================================================================
    //================================================================
    //================================================================
    let deliverToImg = document.getElementById('deliverToImg');
    let url = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZWxsaXBzZSBjeD0iOSIgY3k9IjE0LjQ3OCIgZmlsbD0iI0ZGRTExQiIgcng9IjkiIHJ5PSIzLjUyMiIvPjxwYXRoIGZpbGw9IiMyODc0RjAiIGQ9Ik04LjYwOSA3LjAxYy0xLjA4IDAtMS45NTctLjgyNi0xLjk1Ny0xLjg0NSAwLS40ODkuMjA2LS45NTguNTczLTEuMzA0YTIuMDIgMi4wMiAwIDAgMSAxLjM4NC0uNTRjMS4wOCAwIDEuOTU2LjgyNSAxLjk1NiAxLjg0NCAwIC40OS0uMjA2Ljk1OS0uNTczIDEuMzA1cy0uODY0LjU0LTEuMzgzLjU0ek0zLjEzIDUuMTY1YzAgMy44NzQgNS40NzkgOC45MjIgNS40NzkgOC45MjJzNS40NzgtNS4wNDggNS40NzgtOC45MjJDMTQuMDg3IDIuMzEzIDExLjYzNCAwIDguNjA5IDAgNS41ODMgMCAzLjEzIDIuMzEzIDMuMTMgNS4xNjV6Ii8+PC9nPjwvc3ZnPg==';
    deliverToImg.setAttribute('src', url);

    let cartAddressSelect = document.getElementById('cartAddressSelect');
    let moreCartAddress = document.getElementById('moreCartAddress');
    cartAddressSelect.addEventListener('click', () => {
        if (moreCartAddress.style.display = 'none') {
            moreCartAddress.style.display = 'block';
        } else {
            moreCartAddress.style.display = 'none';
        }
    })

    let cartOfferIcon = document.querySelectorAll('#cartOfferIcon');
    let cartOfferDiv = document.querySelectorAll('#cartOfferDiv');

    for (let i = 0; i < cartOfferIcon.length; i++) {
        cartOfferDiv[i].style.display = 'none';
        cartOfferIcon[i].addEventListener('mouseover', () => {
            cartOfferDiv[i].style.display = 'inline-block';
        })
        cartOfferDiv[i].addEventListener('mouseover', () => {
            cartOfferDiv[i].style.display = 'inline-block';
        })
        cartOfferDiv[i].addEventListener('mouseout', () => {
            cartOfferDiv[i].style.display = 'none';
        })
        cartOfferIcon[i].addEventListener('mouseout', () => {
            cartOfferDiv[i].style.display = 'none';
        })
    }
}
