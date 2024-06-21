import httpService from "./services/http.js";
import { url } from "../utils/shared.js";
import lng from "../utils/language.js";
export class MiniCartMob {
    constructor(store) {
        this.store = store;
        this.lng = lng();
        this.httpService = httpService;
        this.buy$ = document.createElement("div");
        this.cart$ = document.createElement("div");
        this.close$ = document.createElement("div");
        this.loaded = false;
        this.products = [];
        this.element = this._createElement();
        this.closeButton = this.element.querySelector('#header__cart-overlay-close');
        this.listContainer = this.element.querySelector(".header__cart-list");
        this.emptyContainer = this.element.querySelector(".header__cart-empty-wrapper");
        this.actionContainer = this.element.querySelector(".header__cart-actions");
        this.cartSum = this.element.querySelector(".header__cart-sum");
        this.buyButton = this.element.querySelector("#header__cart-overlay-buy");
        this.cartButton = this.element.querySelector("#header__cart-overlay-cart");
        this.listeners();
        this.subscription = this.httpService.cartProducts$.subscribe(productObject => {
            this.products = productObject.products;
            this.loaded = true;
            const {newPrice, oldPrice} = this.products.reduce((acc, item) => {
                acc.newPrice += Math.floor(item.price - (item.price * (item.discount/100))) * item.quantity;
                acc.oldPrice += item.price * item.quantity;
                return acc;
            }, {newPrice:0, oldPrice:0});
            this.newPrice = newPrice;
            this.oldPrice = Math.floor(oldPrice);
            this.renderCartList();
            this.renderCartSum();
            this.loadingState();
           })
    }

    _createElement() {
        const template = `
        <div class="header__cart-overlay cart-overlay-mobile">
        <div class="header__cart-overlay-wrapper mobile-cart-wrapper">
            <div class="header__cart-overlay-title">
                 ${this.store.myCart}
                <button class="button" id="header__cart-overlay-close">
                    <i class="material-symbols-outlined">close</i>    
                </button>

            </div>
            <div class="header__cart-list mobile-cart-list" style="display:none;"></div>
            <div class="header__cart-bottom mobile-cart-bottom">
             <div class="header__cart-sum" style="display:none;"></div>
             <div class="header__cart-actions wrapper">
              <a href="/${this.lng}/buy" class="button button-buy" id="header__cart-overlay-buy">${this.store.buy}</a>
              <a href="/${this.lng}/cart" class="button button-cart" id="header__cart-overlay-cart">${this.store.detailed}</a>
             </div> 
            </div>
            <div class="header__cart-empty-wrapper" style="display:none;">
              <div class="header__cart-empty-flex">
                <img src="/public/images/assets/empty-cart.png" width="100" height="70">
              </div>
              <div class="header__cart-message">
                ${this.store.empty}
              </div>
            </div>
            
        </div>
    </div>
        `
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    }

    renderCartList() {
        this.listContainer.innerHTML = '';
        this.products.forEach((product, i) => {
            const listItem = document.createElement('div');
            const image = document.createElement('img');
            const content = document.createElement('div');
            const title = document.createElement('h3');
            const priceLine = document.createElement('div');
            const quantityLine = document.createElement('div');
            const meta = document.createElement('div');
            const deleteIcon = document.createElement('i');

            listItem.classList.add('header__cart-list-item');
            image.classList.add('header__cart-list-item-img');
            content.classList.add('header__cart-list-item-content');
            title.classList.add('header__cart-list-item-title');
            priceLine.classList.add('header__cart-list-item-line');
            quantityLine.classList.add('header__cart-list-item-line');
            meta.classList.add('header__cart-list-item-meta');
            deleteIcon.classList.add('material-symbols-outlined');
            deleteIcon.classList.add('c-crimson')
            deleteIcon.textContent = 'delete';

            image.src = `${url}${product.images[0]}`;
            title.textContent = `${this.lng === 'en' ? product.nameEng : product.nameGeo}`;
            priceLine.textContent = `${product.price}₾`;
            quantityLine.textContent = `${this.store.quantity}: ${product.quantity}`;

            listItem.appendChild(image);
            content.appendChild(title);
            content.appendChild(priceLine);
            content.appendChild(quantityLine);
            listItem.appendChild(content);
            meta.appendChild(deleteIcon);
            listItem.appendChild(meta);

            deleteIcon.addEventListener("click", () => {
                this.httpService.removeFromCart(this.products[i])
                console.log(this.products[i])
            })
            this.listContainer.appendChild(listItem);
        })
    }

    renderCartSum() {
        const template = `
          <div class="cart-sum">
            <div class="price">
              ${this.store.productsPrice}
              <span class="price-max">${this.oldPrice}₾</span> 
            </div>
            <div class="price sale">
              ${this.store.productsDiscount}
              <span class="price-max">-${this.oldPrice-this.newPrice}₾</span>
            </div>
            <div class="price total">
              ${this.store.totalPrice}
              <span class="price-max">${this.newPrice}₾</span>
            </div>
          </div>
        `
        this.cartSum.innerHTML = template;
        this.cartSum.style.display = 'block';
    }





    loadingState() {
        if(this.loaded && this.products.length === 0) {
            this.listContainer.style.display = 'none';
            this.emptyContainer.style.display = 'block';
            this.actionContainer.style.display = 'none';
            this.cartSum.style.display = 'none';
        } else if(this.loaded && this.products.length > 0) {
            console.log(2);
            this.listContainer.style.display = 'block';;
            this.emptyContainer.style.display = 'none';
            this.actionContainer.style.display = 'flex';
            this.cartSum.style.display = 'block';
        } else {
            console.log(3)
            this.listContainer.style.display = 'none';
            this.emptyContainer.style.display = 'none';
            this.actionContainer.style.display = 'none';
            this.cartSum.style.display = 'none';
        }
    }

    listeners() {
        this.buyButton.addEventListener("click", () => {
            this.buy$.dispatchEvent(new CustomEvent("buy"));
        });
        this.cartButton.addEventListener("click", () => {
            this.cart$.dispatchEvent(new CustomEvent("cart"))
        });
        this.closeButton.addEventListener("click", () => {
            this.detach();
        });
    }
    detach() {
        this.close$.dispatchEvent(new CustomEvent("closed"));
        document.removeEventListener("click", this.handleOutsideClick);
        this.subscription();
    }
}