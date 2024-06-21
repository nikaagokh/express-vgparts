import { url } from "../utils/shared.js";

export class ImageZoom {
    constructor(image, store) {
        this.close$ = document.createElement("div");
        this.active = 0;
        this.zoom = 1.1;
        this.store = store
        this.imageArray = [image];
        this.element = this._createElement();
        this.zoomImg = this.element.querySelector("#zoom-img");
        this.zoomNumber = this.element.querySelector(".zoom-number");
        this.closeButton = this.element.querySelector("#z-closeButton");
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.listeners();
    }

    _createElement() {
        const template = `
        <div class="zoom-container">
        <div class="header-zoom-wrapper">
            <div class="header-zoom">
                <div class="zoom-title">${this.store.gallery}</div>
                <div class="zoom-number">
                    ${this.zoom}X
                </div>
                 <button class="turnoff button button-icon" id="z-closeButton">
                     <i class="material-symbols-outlined">close</i>
                 </button>
            </div>
        </div>
        <div class="img-container">
            <img src="${url}${this.imageArray[this.active]}" alt="ავტომობილი ავტონაწილი" id="zoom-img">
            <div class="left">
                <button class="button button-icon">
                    <i class="material-symbols-outlined">keyboard_arrow_left</i>
                </button>
            </div>
            <div class="right">
            <button class="button button-icon">
            <i class="material-symbols-outlined">keyboard_arrow_right</i>
        </button>
            </div>
        </div>
        
    </div>
        `

        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    }

    listeners() {
        this.zoomImg.addEventListener("mouseenter", this.mouseEnter);
        this.zoomImg.addEventListener("mousemove", this.mouseMove);
        this.zoomImg.addEventListener("mouseleave", this.mouseLeave);
        this.closeButton.addEventListener("click", () => {
            this.close$.dispatchEvent(new CustomEvent('closed'));
        })
    }

    mouseEnter(e) {
        this.zoomImg.addEventListener("wheel", (ev) => {
            ev.preventDefault();
            const wh = (ev.deltaY* -0.001);
            if((this.zoom > 1.09 && this.zoom < 3.99) || (this.zoom <=1.09 && wh > 0  || this.zoom >=3.99 && wh < 0 )) {
                this.zoom+=wh;
                this.zoomImg.style.setProperty('--zoom', `${this.zoom}`);
                this.zoomNumber.textContent = `${this.zoom.toFixed(1)}X`;
            }
            
        })
    }

    mouseLeave(e) {
        this.zoomImg.style.setProperty('--x', '50%');
        this.zoomImg.style.setProperty('--y', '50%');
    }

    mouseMove(e) {
        this.zoomImg.style.setProperty('--x',(100*e.offsetX/this.zoomImg.offsetWidth)+'%');
        this.zoomImg.style.setProperty('--y',(100*e.offsetY/this.zoomImg.offsetHeight)+'%');
        this.zoomImg.style.setProperty('--zoom', `${this.zoom}`); 
    }

    zoomIn() {

    }

    zoomOut() {

    }

    detach() {}
}