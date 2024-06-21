import { url } from "../utils/shared.js";
import httpService from "./services/http.js";
import lng from '../utils/language.js';
export class SearchMob {
    constructor() {
        this.httpService = httpService;
        this.close$ = document.createElement("div");
        this.loaded = true;
        this.word = '';
        this.offset = 1;
        this.lng = lng();
        this.products = [];
        this.element = this._createElement();
        this.searchContent = this.element.querySelector(".search-content");
        this.listContainer = this.element.querySelector(".list");
        this.emptyContainer = this.element.querySelector(".not-exist-wrapper");
        this.spinnerContainer = this.element.querySelector(".searchmob-spinner");
        this.backIcon = this.element.querySelector(".searchmob-icon-left");
        this.searchIcon = this.element.querySelector(".searchmob-icon-right");
        this.mobSearch = this.element.querySelector("#mobSearch");
        this.searchMore = this.element.querySelector(".searchmob-button");
        this.mobSearch.addEventListener("input", this.debounce(this.handleInputDebounced,500));
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleLoadingState();
        this.listeners();
    }

    _createElement() {
        const template = `
              <div class="search-container">
        <div class="search-inputwrapper">
            <div class="search-input">
              <button class="button button-icon">
                <i class="material-symbols-outlined searchmob-icon-left">arrow_back</i>
              </button>
              <i class="material-symbols-outlined searchmob-icon-right">search</i>
              <input type="text" placeholder="" class="header__input-search" id="mobSearch">
            </div>

        </div>
        <div class="search-content">
            <div class="list"></div>
            <div class="not-exist-wrapper" style="display:none;">
                <div class="not-exist" *ngIf="notexist">
                    <img src="/public/images/assets/search4.png" class="not-exist-img" width="120px" height="60px">
                    <div class="not-exist-title">მსგავსი პროდუქტი ვერ მოიძებნა!</div>
                </div>

                <div class="famous-searches">
                    <div class="top-wrapper">
                        <span class="top">
                            Top კატეგორიები
                        </span>
                    </div>
                    <div class="searched-flex">
                        <div class="col">
                            <a href="/${this.lng}/groupby?path=prius&group=პრიუსები&page=1" class="searched-wrapper" (click)="changeRoute('prius', 'პრიუსის ავტონაწილები')">
                                <img src="/public/images/assets/carpart.png" height="25" width="25">
                                პრიუსის ნაწილები
                            </a>
                            <a href="/${this.lng}/groupby?path=cars&group=ავტომანქანები&page=1" class="searched-wrapper" (click)="changeRoute('cars', 'ავტომანქანები')">
                                <img src="/public/images/assets/carpart5.png" height="25" width="25">
                                ავტომანქანები
                            </a>
                        </div>
                        <div class="col">
                            <a href="/${this.lng}/groupby?path=discounted&group=ფასდაკლებები&page=1" class="searched-wrapper" (click)="changeRoute('discounted', 'ფასდაკლებები')">
                                <img src="/public/images/assets/discount.png" height="25" width="25">
                                ფასდაკლებები
                            </a>
                            <a href="/${this.lng}/groupby?path=popular&group=პოპულარულები&page=1" class="searched-wrapper" (click)="changeRoute('popular', 'პოპულარულები')">
                                <img src="/public/images/assets/popular.png" width="25" height="25">
                                პოპულარულები
                            </a>
                        </div>
                    </div>
                </div>

            </div>
            <div class="searchmob-more">
              <button class="button searchmob-button">მეტის ნახვა</button>
            </div>
            <div class="searchmob-spinner" style="display:none;">
               <svg class="spinner" width="35px" height="35px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                 <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                </svg>
            </div>
        </div>
    </div>
        `;

        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    }

    async fetchData() {
        this.loaded = false;
        this.handleLoadingState();
        this.products = (await this.httpService.searchByWord(this.word, this.offset)).response;
        console.log(this.products)
        this.loaded = true;
        this.handleLoadingState();
        this.renderList();
    }

    listeners() {
        this.backIcon.addEventListener("click", () => {
            this.detach();
        })
        this.searchMore.addEventListener("click", () => {
            this.loadMore();
        })
        setTimeout(() => document.addEventListener("click", this.handleOutsideClick));
    }

    async loadMore() {
        this.offset++;
        this.loaded = false;
        const scrolled = this.searchContent.scrollTop;
        this.handleLoadingState();
        const prods = (await this.httpService.searchByWord(this.word, this.offset)).response;
        this.products = this.products.concat(prods);
        this.loaded = true;
        this.handleLoadingState();
        this.renderList();
        this.searchContent.scrollTo({
            top:scrolled,
            behavior:'instant'
        });
    }

    handleLoadingState() {
        if(this.loaded && this.products.length > 0) {
            this.listContainer.style.display = 'block';
            this.spinnerContainer.style.display = 'none';
            this.emptyContainer.style.display = 'none';
            this.searchMore.style.display = 'block';
        } else if(this.loaded && this.products.length === 0 && this.word === '') {
            this.listContainer.style.display = 'none';
            this.spinnerContainer.style.display = 'none';
            this.emptyContainer.style.display = 'none';
            this.searchMore.style.display = 'none';
        } else if(this.loaded && this.products.length === 0 && this.word !== '') {
            this.listContainer.style.display = 'none';
            this.spinnerContainer.style.display = 'none';
            this.emptyContainer.style.display = 'block';
            this.searchMore.style.display = 'none';
        } else {
            this.listContainer.style.display = 'none';
            this.spinnerContainer.style.display = 'block';
            this.emptyContainer.style.display = 'none';
            this.searchMore.style.display = 'none';
        }
    }

    handleOutsideClick(ev) {
        const inside = ev.composedPath().some(el => {
            return this.element === el
        });
        if (!inside) {
            this.detach();
        };
    }

    debounce(func, delay) {
        return function(...args) {
          clearTimeout(this.timeoutId);
          this.timeoutId = setTimeout(() => {
            func.apply(this, args);
          }, delay);
        }.bind(this);
    }

    handleInputDebounced(ev) {
        const word = ev.target.value;
        if (word.length !== 0 && word !== this.word) {
          this.word = word;
          this.fetchData();
        } 
    }

    renderList() {
        this.listContainer.innerHTML = '';
        this.products.forEach((item,index) => {
            const listItem = document.createElement("a");
            listItem.classList.add("search-list-item");
            listItem.setAttribute("tabindex", '0');
            listItem.href = `/${this.lng}/product/${item.id}`
            console.log(listItem)
            listItem.setAttribute("data-link", '')
            listItem.addEventListener("click", () => this.detach());

            const img = document.createElement("img");
            img.classList.add("search-list-img");
            img.src = `${url}${item.images[0]}`;

            const content = document.createElement("span");
            content.classList.add("search-list-content");
            const title = document.createElement("h4");
            title.classList.add("search-list-title");
            title.textContent = `${item.nameGeo}`;
            
            const price = document.createElement("p");
            price.classList.add("search-list-price");
            price.textContent = `${item.price}₾`;

            content.appendChild(title);
            content.appendChild(price);
            listItem.appendChild(img);
            listItem.appendChild(content);
            this.listContainer.appendChild(listItem);
            if(index !== this.products.length - 1) {
                ///
            }
         })
         this.listContainer.style.display = 'block';
    }

    detach() {
        this.close$.dispatchEvent(new CustomEvent("closed"));
        document.removeEventListener("click", this.handleOutsideClick);
    }
}