import overlayService from "./services/overlay.js";
import httpService from "./services/http.js";
export class Bottom {
    constructor() {
        this.httpService = httpService;
        this.overlayService = overlayService;
        this.homeButton = document.querySelector('#b-homeButton');
        this.menuButton = document.querySelector("#b-menuButton");
        this.searchButton = document.querySelector('#b-searchButton');
        this.cartButton = document.querySelector("#b-cartButton");
        this.userButton = document.querySelector('#b-userButton');
        this.badgeCart = document.querySelector("#b-badgeCart");
        this.listeners();
    }

    listeners() {
        this.homeButton.addEventListener("click", () => {
            this.overlayService.routerLink();
        })

        this.menuButton.addEventListener("click", () => {
            this.overlayService.openMenu();
        })

        this.searchButton.addEventListener("click", () => {
            this.overlayService.openSearchMob();
        });
        this.cartButton.addEventListener("click", () => {
            this.overlayService.openCart();
        })

        this.userButton.addEventListener("click", () => {
            this.overlayService.openAuth();
        })
        this.httpService.cartProducts$.subscribe(cartObject => {
            let quantity = 0;
            if(cartObject.products.length > 0) {
                quantity = cartObject.products?.reduce((acc, curr) => {
                    return acc + curr.quantity;
                }, 0)
            } else {
                quantity = 0;
            }
            this.badgeCart.textContent = quantity;
        })
    }
}