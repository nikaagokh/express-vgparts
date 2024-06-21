import httpService from "./services/http.js";
import toastService from "./services/toast.js";
import overlayService from "./services/overlay.js";
import socketService from "./services/socket.js";
export class Slider {
    constructor(group) {
        this.group = group;
        this.socketService = socketService;
        this.socketService.initSocket();
        this.httpService = httpService;
        this.overlayService = overlayService;
        this.toastService = toastService;
        this.size = document.querySelector(".app-slider__card").clientWidth;
        this.sliderContainer = document.querySelector(`.${this.group}__container`);
        this.sliderBody = this.sliderContainer.querySelector('.app-slider__body');
        this.productFlex = this.sliderContainer.querySelector(".app-slider__flex");
        this.products = JSON.parse(this.sliderContainer.querySelector(`.slider-${this.group}`).textContent);
        this.pos = 0;
        this.loc = 0;
        this.start = 0;
        this.end = 0;
        this.listeners();
    }
    listeners() {
            const zoomButtons = this.sliderContainer.querySelectorAll("#app-slider__zoom");
            const favButtons = this.sliderContainer.querySelectorAll("#app-slider__favorite");
            const cartButtons = this.sliderContainer.querySelectorAll("#app-slider__cart");
            const prevButton = this.sliderContainer.querySelector(".app-slider__prev");
            const nextButton = this.sliderContainer.querySelector(".app-slider__next");
            zoomButtons.forEach((zoom, i) => {
                zoom.addEventListener("click", () => {
                    this.overlayService.openZoom(this.products[i].images[0])
                })
            })
    
            favButtons.forEach((fav,i) => {
                fav.addEventListener("click", () => {
                    this.toastService.showToast("თქვენ არ ხართ ავტორიზებული, გთხოვთ გაიაროთ რეგისტრაცია ან ავტორიზაცია");
                })
            })
    
            cartButtons.forEach((cart, i) => {
                cart.addEventListener("click", () => {
                    this.httpService.addToCart(this.products[i]);
                })
            })
    
            prevButton.addEventListener("click", () => {
                if(this.pos !== 0) {
                    this.pos--;
                    this.updateSlidePosition();
                }
            })
    
            nextButton.addEventListener("click", () => {
                if(this.products.length > 4 && this.products.length > this.pos + 4) {
                    this.pos++;
                    this.updateSlidePosition();
                }
            })

            this.touchListeners();
    }

    touchListeners() {
        this.sliderBody.addEventListener("touchstart", (ev) => {
            this.start = ev.changedTouches[0].pageX;
        })
        this.sliderBody.addEventListener("touchend", (ev) => {
            this.end = ev.changedTouches[0].pageX;
            const diff = this.end - this.start;
            if(diff < - 50) {
                this.pos++;
                this.updateSlidePosition();
            } else if (diff > 50 && this.pos > 0) {
                this.pos--;
                this.updateSlidePosition();
            } 
        })
    }

    updateSlidePosition() {
        this.loc = -(this.size * this.pos) - (this.pos * 10);
        this.productFlex.style.transform = `translateX(${this.loc}px)`;
    }
}