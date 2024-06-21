import { sub, caturl } from "../utils/shared.js"
import { disableScroll } from "../utils/disableScroll.js";
import { enableScroll } from "../utils/enableScroll.js";
import httpService from "./services/http.js";
export class MenuDesktop {
    constructor(categories) {
        this.loaded = false;
        this.loadNum = 0;
        this.httpService = httpService;
        this.lng = this.httpService.getLanguage();
        this.categories = categories;
        this.closed$ = document.createElement("div");
        this.parent = document.querySelector(".header");
        this.element = this._createElement();
        this.loader = this.element.querySelector(".header__menu-loader");
        this.listItem = this.element.querySelectorAll(".header__menu-list-item");
        this.subCategory = this.element.querySelector(".header__menu-content-grid");
        this.subcat = this.element.querySelectorAll(".header__menu-card-flex");
        this.attach();
        this.listeners();
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        document.addEventListener("click", this.handleOutsideClick);
    }

    _createElement() {
        const template = `
        <div class="header__menu-desktop">
        <div class="header__menu-desktop-wrapper">
         <div class="header__mega-menu">
           <div class="header__menu-list">
           ${this.categories.map(item => `
           <div class="header__menu-list-item">
           <img src="${caturl}${item.image}" class="header__menu-img">
           <h2 class="header__menu-title">${item.name}</h2>
           <button class="button button-icon header__button" role="button">
             <i class="material-symbols-outlined">keyboard_arrow_right</i>
           </button>
           </div>
            `).join('')}
           </div>
          </div>
          <div class="header__menu-content-wrapper">
          <div class="header__menu-content-grid"></div>
          <div class="header__menu-loader" style="display:none">
          <div class="header__menu-loader-centered">
            <svg class="spinner" width="35px" height="35px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
              <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
            </svg>
          </div>
        </div>
        </div>
       </div>
      </div>
        `
        const tempContainer = document.createElement("div");
        tempContainer.classList.add("header__menu-desktop-absolute");
        tempContainer.innerHTML = template;
        return tempContainer;
    }

    attach() {
        this.parent.appendChild(this.element);
        disableScroll();
    }

    listeners() {
        this.listItem.forEach((item, i) => {
            item.addEventListener("click", () => {
                this.listItem.forEach(item => {
                    item.classList.remove("active");
                })
                item.classList.add("active");
                this.renderSubCategories(this.categories[i].subcategories);
            })
        })
    }

    renderSubCategories(subcategories) {
        this.loaded = false;
        this.loadNum = 0;
        this.handleLoadingState();
        const template = `
    ${subcategories.map(subcategory => 
        subcategory.images.map(cyear => `
            <a href="/${this.lng}/category?yearId=${cyear.id}&categoryId=${subcategory.id}&page=1" class="header__menu-card-flex" data-link>
                <div class="header__menu-card-imgwrapper">
                    <img src="${sub}${cyear.imageUrl}" class="header__menu-card-img">
                </div>
                <div class="header__menu-card-description">
                    <span class="header__menu-card-title">${subcategory.name}</span>
                    <span class="header__menu-card-year">${Math.floor(Math.random() * (2018 - 2008 + 1)) + 2008}</span>
                </div>
            </a>
        `).join('')).join('')}
        `;
        this.subCategory.innerHTML = template;
        const imgs = this.subCategory.querySelectorAll(".header__menu-card-img");
        imgs.forEach(img => {
            img.addEventListener("load", () => {
                this.loadNum++;
                console.log('load')
                if(this.loadNum >= imgs.length) {
                    console.log(123)
                    this.loaded = true;
                    this.handleLoadingState();
                }
            })
            img.addEventListener("error", () => {
                this.loadNum++;
                if(this.loadNum === 4) {
                    console.log(123);
                    this.loaded = true;
                    this.handleLoadingState();
                }
            })
        })
        this.subCategory.querySelectorAll(".header__menu-card-flex").forEach(sub => {
            sub.addEventListener("click", () => {
                this.detach();
            })
        })
        //const tempContainer = document.createElement("div");
        //tempContainer.innerHTML = template;
        //return tempContainer.firstElementChild
    }

    handleLoadingState() {
        if(this.loaded) {
            this.subCategory.style.display = 'flex';
            this.loader.style.display = 'none';
        } else {
            this.subCategory.style.display = 'none';
            this.loader.style.display = 'block';
        }
    }

    detach() {
        this.parent.removeChild(this.element);
        document.removeEventListener("click", this.handleOutsideClick);
        enableScroll()
        this.closed$.dispatchEvent(new CustomEvent("closed"));
    }

    handleOutsideClick(ev) {
        const inside = ev.composedPath().some(el => {
            return this.element === el
        });
        if (!inside) {
            this.detach();
        };
    }






}