import { Similars } from "./similars.js";
import httpService from "./services/http.js";
import overlayService from "./services/overlay.js";
import toastService from "./services/toast.js";
export class Product {
    constructor() {
        this.overlayService = overlayService;
        this.httpService = httpService;
        this.toastService = toastService;
        this.cartButton = document.querySelector('#cart-button');
        this.buyButton = document.querySelector("#buy-button");
        this.product = JSON.parse(document.querySelector(".product-hydration").textContent);
        this.similars = JSON.parse(document.querySelector(".similars-hydration").textContent);
        new Similars();
        this.listeners();
    }

    listeners() {
        this.cartButton.addEventListener("click", () => {
            this.httpService.addToCart(this.product);
        })
    }
}