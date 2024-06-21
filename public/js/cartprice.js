export class CartPrice {
    constructor() {
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
    }
}