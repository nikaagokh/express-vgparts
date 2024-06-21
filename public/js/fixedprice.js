import httpService from "./services/http.js";
export class FixedPrice {
    constructor() {
        this.httpService = httpService;
        this.scrolled = 0;
        this.product = JSON.parse(document.querySelector(".product-hydration").textContent);
        this.fixedpriceContainer = document.querySelector(".fixedprice-container");
        this.cartButton = this.fixedpriceContainer.querySelector("#fixedpriceCart");
        this.debounce = this.debounce.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.listeners();
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        }
    }

    handleScroll(ev) {
        console.log(ev);
        const scr = window.scrollY;
        const divide = scr - this.scrolled;
        if (divide > 10) {
            this.fixedpriceContainer.classList.add("fixedprice-bottom");
        } else if (divide < -5) {
            this.fixedpriceContainer.classList.remove("fixedprice-bottom");
        }
        this.scrolled = scr;
    }
    listeners() {
        window.addEventListener("scroll", this.debounce(this.handleScroll, 100));
        this.cartButton.addEventListener("click", () => {
            console.log(this.product)
            this.httpService.addToCart(this.product);
        })
    }
}