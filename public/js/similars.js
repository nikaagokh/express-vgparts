import toastService from "./services/toast.js";
import httpService from "./services/http.js";
import overlayService from "./services/overlay.js";
export class Similars {
    constructor() {
        this.toastService = toastService;
        this.httpService = httpService;
        this.overlayService = overlayService;
        this.pos = 0;
        this.loc = 0;
        this.sliderFlex = document.querySelector(".app-slider__flex");
        this.size = document.querySelector(".app-slider__card")?.clientWidth;
        this.favButton = document.querySelectorAll("#app-slider__favorite");
        this.cartButton = document.querySelectorAll("#app-slider__cart");
        this.zoomButton = document.querySelectorAll("#app-slider__zoom");
        this.prevButton = document.querySelector(".app-slider__prev");
        this.nextButton = document.querySelector(".app-slider__next");
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
            this.overlayService.openZoom(this.products[i].images[0].path);
        })
       })
       this.prevButton.addEventListener("click", () => {
          console.log('prev')
          if(this.pos !== 0) {
            this.pos--;
            this.updateSlidePosition();
        }
    })

        this.nextButton.addEventListener("click", () => {
           if(this.products.length > 4) {
              console.log('nexted')
              this.pos++;
              this.updateSlidePosition();
        }
    })

       this.products = JSON.parse(document.querySelector(".similars-hydration").textContent);
    }

    updateSlidePosition() {
        this.loc = -(this.size * this.pos) - (this.pos * 10);
        this.sliderFlex.style.transform = `translateX(${this.loc}px)`;
    }

}