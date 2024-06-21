import lng from '../utils/language.js';
import {url} from '../utils/shared.js';
import overlayService from './services/overlay.js';
export class Slider3d {
    constructor() {
        this.middle = 1;
        this.lng = lng();
        this.cardContainer = document.querySelector('.slider3d-div');
        this.leftButton = document.querySelector('.slider3d-left');
        this.rightButton = document.querySelector('.slider3d-right');
        this.products = JSON.parse(document.querySelector('.slider3d-hydration').textContent);
        this.listeners();
        this.leftButton.addEventListener("click", () => {
            const lastEl = this.products.pop();
            this.products.unshift(lastEl);
            this.renderProducts(true);
        })
        this.rightButton.addEventListener("click", () => {
            const firstEl = this.products.shift();
            this.products.push(firstEl);
            this.renderProducts(false);
        })
        overlayService.fetchStore('sliderd').then(data => {
            this.store = data;
        })
    }

    listeners() {
        const cardFlex = document.querySelectorAll('.slider3d-cardFlex');
        cardFlex.forEach((item, i) => {
            item.addEventListener("click", (ev) => {
                cardFlex.forEach((obj) => {
                    obj.classList.remove('activated-fromleft');
                    obj.classList.remove('activated-fromright');
                    obj.classList.remove('middled-fromleft');
                    obj.classList.remove('middled-fromright');
                })
                if(this.middle > i) {
                    const lastEl = this.products.pop();
                    this.products.unshift(lastEl);
                    this.renderProducts(true);
                } else if (this.middle < i) {
                    const firstEl = this.products.shift();
                    this.products.push(firstEl);
                    this.renderProducts(false);
                }
            })
        })

    }

    renderProducts(rend) {
        const template = `
         ${this.products.map((product, i) => `
              <div class="slider3d-cardFlex ${this.getClass(i)} ${this.getAnimation(rend, i)}" data-id="${i}" style="display:${this.isVisible(i)}">
                    <div class="slider3d-card">
                          <div class="slider3d-wrapper">
                            <div class="slider3d-img-wrapper">
                                <img src="${url + product.images[0]}">
                            </div>
                            <div class="slider3d-description-wrapper">
                                <div class="slider3d-description-title">
                                    ${product.nameGeo}
                                </div>
                                <div class="slider3d-stock">        
                                   ${product.available ? `
                                    <i class="material-symbols-outlined c-success">check</i>
                                    <span>მარაგშია</span>
                                   `:`
                                    <i class="material-symbols-outlined c-crimson">check_indeterminate_small</i>
                                    <span>ამოიწურა</span>
                                   `}
                                </div>
                                <div class="slider3d-actions">
                                  <div class="slider3d-price">${product.price}₾</div>
                                  <a href="/${this.lng}/product/${product.id}" class="slider3d-button">${this.store.detailed}</a>
                                </div>
                            </div>
                            
                            </div>
                          </div>
                       
                    </div>
                </div>
            `)}
        `;
        this.cardContainer.innerHTML = template;
        this.listeners();
    }

    getClass(index) {
        if(index === 0) {
            return 'middle-left';
        } else if(index === 1) {
            return 'slider3d-active';
        } else {
            return 'middle-right';
        }
    }

    getAnimation(rend, i) {
        if(rend) {
            if(i === 1) {
                return 'activated-fromleft';
            } else if (i === 2) {
                return 'middled-fromleft';
            }
        } else {
            if(i === 1) {
                return 'activated-fromright';
            } else if (i === 0) {
                return 'middled-fromright';
            }
        }
    }

    isVisible(i) {
        if(i === 0 || i === 1 || i === 2) {
            return 'block';
        } else {
            return 'none';
        }
    }

}