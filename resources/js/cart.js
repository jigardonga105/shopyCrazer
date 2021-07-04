import axios from "axios";
import Noty from "noty";

export function cart() {
    let addToCartBtn = document.getElementsByClassName('addToCartBtn');
    let cartCounter = document.getElementById('cartCounter');

    function cartUpdateNoty(msg, type) {
        new Noty({
            type: type,
            timeout: 1000,
            text: msg,
            progressBar: false,
        }).show();
    }


    function updateCart(product) {
        axios.post('/updateCart', { product })
            .then(response => {
                if (response.data.msg) {
                    let msg = response.data.msg;
                    if (msg == 'You are not logged in') {
                        cartUpdateNoty(msg, 'information');
                    } else if (msg == 'We are facing some essuse. Please try again later 🙏') {
                        cartUpdateNoty(msg, 'information');
                    }
                } else if (response.data.totalQty) {
                    let totalQty = response.data.totalQty;

                    // cartCounter.innerText = '';
                    cartCounter.innerText = totalQty;

                    cartUpdateNoty('Item added to cart', 'success');
                }
            })
            .catch(err => {
                cartUpdateNoty('Something went wrong', 'error');
            })
    }

    if (addToCartBtn) {
        for (let i = 0; i < addToCartBtn.length; i++) {
            let btn = addToCartBtn[i];

            btn.addEventListener('click', (e) => {
                let product = JSON.parse(btn.dataset.product)
                    // console.log(product);
                updateCart(product)
            })
        }
    }
}