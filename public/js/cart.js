import { url } from "../utils/shared.js";
import httpService from "./services/http.js";
import overlayService from "./services/overlay.js";
export class Cart {
    constructor() {
        this.overlayService = overlayService;
        this.httpService = httpService;
        this.innerContainer = document.querySelector('.inner-wrapper');
        this.cartContainer = document.querySelector('.cart-container');
        this.emptyContainer = document.querySelector('.header__cart-empty-wrapper');
        this.priceContainer = document.querySelector('.price-container');
        this.oldPriceSpan = document.querySelector('.oldPrice');
        this.newPriceSpan = document.querySelector('.newPrice');
        this.discountSpan = document.querySelector('.discount');
        this.httpService.cartProducts$.subscribe(productObject => {
            this.products = productObject.products;
            this.loaded = true;
            const {newPrice, oldPrice} = this.products.reduce((acc, item) => {
                acc.newPrice += Math.floor(item.price - (item.price * (item.discount/100))) * item.quantity;
                acc.oldPrice += item.price * item.quantity;
                return acc;
            }, {newPrice:0, oldPrice:0});
            this.newPricey = newPrice;
            this.oldPricey = Math.floor(oldPrice);
            this.discount = newPrice - oldPrice;
            this.newPriceSpan.textContent = this.newPricey;
            this.oldPriceSpan.textContent = this.oldPricey;
            this.discountSpan.textContent = this.discount;
            const newPriceSpan = document.querySelector("#cartPrice-new");
            const oldPriceSpan = document.querySelector("#cartPrice-old");
            newPriceSpan.textContent = this.newPricey;
            oldPriceSpan.textContent = this.oldPricey;
            this.renderCartList();
        });
        
    }

    renderCartList() {
        this.cartContainer.innerHTML = ''; 
            if(this.products.length > 0) {
                this.emptyContainer.style.display = 'none';
                this.products.forEach((item, i) => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
    
                    const imgWrapper = document.createElement('div');
                    imgWrapper.className = 'img-wrapper';
                    imgWrapper.onclick = () => this.zoomImage(item.images[0]?.path);
                    const img = document.createElement('img');
                    img.src = `${url}${item.images[0]}`;
                    img.className = 'img';
                    img.onload = () => this.loadedOne(i);
                    imgWrapper.appendChild(img);
                    if(item.discount > 0) {
                        const discounted = document.createElement("div");
                        discounted.textContent = `-${item.discount}%`;
                        discounted.classList.add('price-discount');
                        imgWrapper.appendChild(discounted);
                    }
    
                    const descriptionWrapper = document.createElement('div');
                    descriptionWrapper.className = 'description-wrapper';
    
                    const description = document.createElement('div');
                    description.className = 'description';
                    description.textContent = item.nameGeo;
                    descriptionWrapper.appendChild(description);
    
                    const code = document.createElement('div');
                    code.className = 'code';
                    descriptionWrapper.appendChild(code);
    
                    const removeWrapperMd = document.createElement('div');
                    removeWrapperMd.className = 'remove-wrapper md';
                    removeWrapperMd.onclick = () => this.removeItem(item);
    
                    const deleteIconMd = document.createElement('i');
                    deleteIconMd.classList.add('material-symbols-outlined', 'c-crimson');
                    deleteIconMd.textContent = 'delete';
                    removeWrapperMd.appendChild(deleteIconMd);
    
                    const actionWrapper = document.createElement('div');
                    actionWrapper.className = 'action-wrapper';
    
                    const actionFlex = document.createElement('div');
                    actionFlex.className = 'action-flex';

                    
                    const addRemoveFlex = document.createElement('div');
                    addRemoveFlex.className = 'add-remove-flex';
                    /*
                    const removeWrapperSm = document.createElement('div');
                    removeWrapperSm.className = 'remove-wrapper sm';
                    removeWrapperSm.onclick = () => this.removeItem(item);
    
                    const deleteIconSm = document.createElement('mat-icon');
                    deleteIconSm.className = 'delete';
                    deleteIconSm.textContent = 'delete';
                    removeWrapperSm.appendChild(deleteIconSm);
                    */
                    
                    const addWrapper = document.createElement('div');
                    addWrapper.className = 'add-wrapper';
    
                    const minusButton = document.createElement('button');
                    minusButton.className = 'minus-button';
                    minusButton.onclick = () => this.minus(item);
                    minusButton.innerHTML = '<span class="add">-</span>';
    
                    const numberButton = document.createElement('div');
                    numberButton.className = 'number-button';
    
                    const numb = document.createElement('div');
                    numb.className = 'numb';
                    numb.textContent = `${item.quantity} შეკვრა`;
    
                    numberButton.appendChild(numb);
    
                    const plusButton = document.createElement('button');
                    plusButton.className = 'plus-button';
                    plusButton.onclick = () => this.plus(item);
                    plusButton.innerHTML = '<span class="add">+</span>';
    
                    addWrapper.appendChild(minusButton);
                    addWrapper.appendChild(numberButton);
                    addWrapper.appendChild(plusButton);
    
                    //addRemoveFlex.appendChild(removeWrapperSm);
                    addRemoveFlex.appendChild(addWrapper);
    
                    const priceWrapper = document.createElement('div');
                    priceWrapper.classList.add('price-wrapper', 'cart-price-wrapper');
    
                    const priceFlex = document.createElement('div');
                    priceFlex.classList.add('price-flex', 'cart-price-flex');
                    const price = document.createElement('span');
                    price.className = 'price';
                    if (item.discount === 0) {
                        price.textContent = item.price.toFixed(2);
                    } else {
                        const discounted = document.createElement('span');
                        discounted.className = 'fl dot';
                        const textContext = this.newPrice(item).toFixed(2);
                        discounted.textContent = textContext;
                        priceFlex.appendChild(discounted);
                    }
    
                    const priceGel = document.createElement('span');
                    priceGel.className = 'price-gel';
                    priceGel.textContent = '₾.';
    
                    priceFlex.appendChild(price);
                    priceFlex.appendChild(priceGel);
    
                    priceWrapper.appendChild(priceFlex);
    
                    if (item.discount > 0 && item.type === 0) {
                        const oldPrice = document.createElement('div');
                        oldPrice.className = 'oldpric';
    
                        const oldPriceSpan = document.createElement('span');
                        oldPriceSpan.className = 'price old';
                        oldPriceSpan.textContent = item.price.toFixed(2);
    
                        const oldPriceGel = document.createElement('span');
                        oldPriceGel.className = 'price-gel';
                        oldPriceGel.textContent = '₾.';
    
                        oldPrice.appendChild(oldPriceSpan);
                        oldPrice.appendChild(oldPriceGel);
                        priceWrapper.appendChild(oldPrice);
                    }
    
                    actionFlex.appendChild(addRemoveFlex);
                    actionFlex.appendChild(priceWrapper);
                    actionWrapper.appendChild(actionFlex);
    
                    cartItem.appendChild(imgWrapper);
                    cartItem.appendChild(descriptionWrapper);
                    cartItem.appendChild(removeWrapperMd);
                    cartItem.appendChild(actionWrapper);
                    this.cartContainer.appendChild(cartItem);
    
                    if (i !== this.products.length - 1) {
                        const matDivider = document.createElement('mat-divider');
                        matDivider.setAttribute('inset', 'true');
                        this.cartContainer.appendChild(matDivider);
                    }
                });
            } else {
                this.emptyContainer.style.display = 'block';
                this.cartContainer.innerHTML = '';
                this.priceContainer.style.display = 'none';
            }
    }

    zoomImage(path) {
        this.overlayService.openZoom(path);
    }

    loadedOne(index) {}

    removeItem(item) {
        this.httpService.removeFromCart(item);
    }

    minus(item) {
        this.httpService.removeFromCart(item, false);
    }

    plus(item) {
       this.httpService.addToCart(item);
    }

    newPrice(item) {
        return item.price - (item.price * item.discount / 100);
    }
}