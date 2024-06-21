import lng from "../utils/language.js";
import { url } from "../utils/shared.js";
import httpService from "./services/http.js";
export class MiniCart {
    constructor(store) {
        this.lng = lng();
        this.store = store;
        this.buy$ = document.createElement("div");
        this.cart$ = document.createElement("div");
        this.close$ = document.createElement("div");
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleBuy = this.handleBuy.bind(this);
        this.handleCart = this.handleCart.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.loaded = false;
        this.products = [];
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.parent = document.querySelector(".header__right");
        this.element = this._createElement();
        this.attach();
        this.closeButton = document.querySelector('#header__cart-overlay-close');
        this.listContainer = document.querySelector(".header__cart-list");
        this.emptyContainer = document.querySelector(".header__cart-empty-wrapper");
        this.actionContainer = document.querySelector(".header__cart-actions");
        this.cartSum = document.querySelector(".header__cart-sum");
        this.buyButton = document.querySelector("#header__cart-overlay-buy");
        this.cartButton = document.querySelector("#header__cart-overlay-cart");
        this.design();
        //this.fetchData();
        this.httpService = httpService;
        /*
        this.httpService.cartProducts$.addEventListener("cart", (object) => {
            console.log(object);
            this.products = object.detail.products;
            console.log(this.products)
            this.updateMinicartUI();
            this.renderCartList();
        })
        */
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
        this.handleLoadingState();
       })
    }

    updateMinicartUI() {
        if(this.products.length > 0) {
            this.listContainer.style.display = 'block';
            this.emptyContainer.style.display = 'none';
        } else {
            this.listContainer.style.display = 'none';
            this.emptyContainer.style.display = 'block';
        }
    }

    _createElement() {
        const template = `
        <div class="header__cart-overlay">
        <div class="header__cart-overlay-wrapper">
            <div class="header__cart-overlay-title">
                ${this.store.myCart}
                <button class="button" id="header__cart-overlay-close">
                    <i class="material-symbols-outlined">close</i>    
                </button>

            </div>
            <div class="header__cart-list" style="display:none;"></div>
            <div class="header__cart-sum" style="display:none;"></div>
            <div class="header__cart-empty-wrapper" style="display:none;">
              <div class="header__cart-empty-flex">
                <img src="/public/images/assets/empty-cart.png" width="100" height="70">
              </div>
              <div class="header__cart-message">
                ${this.store.empty}
              </div>
            </div>
            <div class="header__cart-actions wrapper">
              <a href="/${this.lng}/buy" class="button button-buy" id="header__cart-overlay-buy">${this.store.buy}</a>
              <a href="/${this.lng}/cart" class="button button-cart" id="header__cart-overlay-cart">${this.store.detailed}</a>
          </div>
        </div>
    </div>
        `
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    }

    attach() {
        this.parent.appendChild(this.element);
    }

    design() {
        this.buyButton.addEventListener("click", this.handleBuy);
        this.cartButton.addEventListener("click", this.handleCart);
        this.closeButton.addEventListener("click", this.handleClose);
        setTimeout(() => document.addEventListener("click", this.handleOutsideClick),0);
    }

    handleBuy() {
        this.buy$.dispatchEvent(new CustomEvent("buy"));
    }

    handleCart() {
        this.cart$.dispatchEvent(new CustomEvent("cart"))
    }

    handleClose() {
        this.detach();
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

    handleLoadingState() {
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

    handleOutsideClick(ev) {
        const inside = ev.composedPath().some(el => {
            return this.element === el
        });
        if (!inside) {
            this.detach();
        };
    }

    detach() {
        this.close$.dispatchEvent(new CustomEvent("closed"));
        this.parent.removeChild(this.element);
        document.removeEventListener("click", this.handleOutsideClick);
        this.subscription();
    }
}