import httpService from "./services/http.js";
import toastService from "./services/toast.js";
import overlayService from "./services/overlay.js";
export class CategoryParts {
    constructor() {
        this.toastService = toastService;
        this.httpService = httpService;
        this.overlayService = overlayService;
        this.favButton = document.querySelectorAll("#app-slider__favorite");
        this.cartButton = document.querySelectorAll("#app-slider__cart");
        this.zoomButton = document.querySelectorAll("#app-slider__zoom");
        this.favButton.forEach((button, i) => {
            button.addEventListener("click", () => {
                this.toastService.showToast("თქვენ არ ხართ ავტორიზებული, გთხოვთ გაიაროთ რეგისტრაცია ან ავტორიზაცია");
            })
        })
        this.cartButton.forEach((button, i) => {
          button.addEventListener("click", () => {
            this.httpService.addToCart(this.products[i])
          })
       })
       this.zoomButton.forEach((button, i) => {
        button.addEventListener("click", () => {
            this.overlayService.openZoom(this.products[i].images[0]);
        })
       })
       this.products = JSON.parse(document.querySelector(".products-hydration").textContent);
    }
}