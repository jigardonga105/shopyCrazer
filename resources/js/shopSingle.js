export function shopSingle() {
    //This is for Image of Product
    let prdInp = document.querySelector('#prdInp');
    let prd = JSON.parse(prdInp.value);

    document.getElementById("color").style.gridTemplateColumns = `repeat(${prd.color.length}, minmax(0, 1fr))`;

    let totalImgLen = prd.image.length;
    totalImgLen = Math.trunc(totalImgLen / 3);

    function oneImgAdd(i, prd, carouselItemDiv) {
        let rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        for (let j = 0; j < 3; j++) {
            if (prd.image[j + (i * 3)] != undefined) {
                let col4Div = document.createElement('div');
                col4Div.classList.add('col-4', 'all-image-div');

                col4Div.innerHTML = `<a href="#">
                                        <img class="card-img img-fluid" src="../uploadedImages/${prd.image[j + (i * 3)].img}" alt="Product Image ${j + (i * 3)}">
                                    </a>`;
                rowDiv.appendChild(col4Div);
            }
        }

        carouselItemDiv.appendChild(rowDiv);

        return carouselItemDiv;
    }

    function addImageDiv(i, carouselDiv, prd) {

        let carouselItemDiv = document.createElement('div');
        if (i === 0) {
            carouselItemDiv.classList.add('carousel-item');
            carouselItemDiv.classList.add('active');

            carouselDiv.appendChild(oneImgAdd(i, prd, carouselItemDiv));

        } else {
            carouselItemDiv.classList.add('carousel-item');

            carouselDiv.appendChild(oneImgAdd(i, prd, carouselItemDiv));
        }



    }

    let carouselDiv = document.querySelector('.carousel-div');

    for (let i = 0; i < totalImgLen + 1; i++) {
        addImageDiv(i, carouselDiv, prd);
    }

    // console.log(carouselDiv);
    // ==================================================================
    // ==================================================================

    //this is for read more specification
    function showHideSpec(btn) {
        if (btn.innerHTML == 'Read More') {
            spec_readmore.innerHTML = 'Collapse';
            document.getElementById("specBody").style.height = "100%";
        } else {
            spec_readmore.innerHTML = 'Read More';
            document.getElementById("specBody").style.height = "300px";
        }
    }
    let spec_readmore = document.querySelector('#spec-readmore');
    spec_readmore.addEventListener('click', () => {
        showHideSpec(spec_readmore);
    })

    // ==================================================================
    // ==================================================================

    //this is for related products
    let relaPrdInp = document.querySelector('#relaPrdInp');
    let relaPrd = JSON.parse(relaPrdInp.value);
    let cardGroup = document.querySelector('.card-group');

    for (let i = 0; i < relaPrd.length; i++) {
        for (let key in relaPrd) {
            var id = relaPrd[i]._id;
            var imgPath = relaPrd[i].image[0].img;
            var name = relaPrd[i].name;
            if (name.length > 16) {
                name = name.substring(0, 16);
                name = name + '...';
            }
            var rating = relaPrd[i].rating;
            var vote = relaPrd[i].vote;
            var price = relaPrd[i].price;
        }
        cardGroup.innerHTML += `<div class="card cardCss">
                                    <div class="inner-card">
                                        <a href="/productview/${id}">
                                            <div class="card-img-div">
                                                <img src="../../uploadedImages/${imgPath}" class="card-img-top" alt="..." />
                                            </div>
                                        </a>
                                        <div class="card-body">
                                            <a href="/productview/${id}">
                                                <h6 class="card-title">${name}</h6>
                                            </a>
                                            <ul class="rating-vote-ul">
                                                <li class="rating-vote-li1">
                                                    ${rating}&nbsp;<i class="text-muted fa fa-star"></i>
                                                </li>
                                                <li class="rating-vote-li2">
                                                    (${vote})
                                                </li>
                                            </ul>
                                            <span class="rela-priceSpan">₹${price}</span>
                                        </div>
                                    </div>
                                </div>`;
    }


    // ===========================================================
    // ===========================================================

    //this is for related products carousel preq-next Button
    const gap = 16;

    const carousel = document.getElementById("carousel"),
        content = document.getElementById("content"),
        next = document.getElementById("next"),
        prev = document.getElementById("prev");

    next.addEventListener("click", (e) => {
        carousel.scrollBy(width + gap, 0);
        if (carousel.scrollWidth !== 0) {
            prev.style.display = "flex";
        }
        if (content.scrollWidth - width - gap <= carousel.scrollLeft + width) {
            next.style.display = "none";
        }
    });
    prev.addEventListener("click", (e) => {
        carousel.scrollBy(-(width + gap), 0);
        if (carousel.scrollLeft - width - gap <= 0) {
            prev.style.display = "none";
        }
        if (!content.scrollWidth - width - gap <= carousel.scrollLeft + width) {
            next.style.display = "flex";
        }
    });

    let width = carousel.offsetWidth;
    window.addEventListener("resize", (e) => (width = carousel.offsetWidth));
}