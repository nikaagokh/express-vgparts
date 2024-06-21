import lng from "../utils/language.js";
import { url } from "../utils/shared.js";
import httpService from "./services/http.js";
export class SearchBox {
    constructor() {
        this.word = '';
        this.loaded = false;
        this.lng = lng();
        this.httpService = httpService;
        this.loadNum = 0;
        this.products = [];
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.parent = document.querySelector(".header__input-wrapper");
        this.element = this._createElement();
        this.attach();
        this.headerInput = document.querySelector(".header__input-search");
        this.headerInputBox = document.querySelector(".header__input-box");
        this.listContainer = document.querySelector(".header__input-box-list");
        this.spinnerContainer = document.querySelector(".header__input-spinner");
        this.notExistContainer = document.querySelector(".header__input-not-exist-wrapper");
        this.design();
        this.notifier = document.createElement("div");
    }

    _createElement() {
        const template = `
        <div class="header__input-box">
        <div class="header__input-box-list"></div>
        <div class="header__input-spinner">
          <div class="header__input-centered">
            <svg class="spinner" width="35px" height="35px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
              <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
            </svg>
          </div>
        </div>
          <div class="header__input-not-exist-wrapper">
                <div class="header__input-not-exist">
                    <img src="/public/images/assets/search4.png" width="60" height="60">
                    <div class="header__input-not-exist-title">მსგავსი პროდუქტი ვერ მოიძებნა!</div>
                </div>
                <div class="header__input-famous-searches">
                    <div class="header__input-famous-searches-wrapper">
                        <span class="header__input-famous-searches-title">
                            Top კატეგორიები
                        </span>
                    </div> 
                    <div class="header__input-famouse-searches-bodyflex">
                        <div class="header__input-col">
                            <div class="header__input-searched-wrapper" (click)="changeRoute('prius', 'პრიუსის ავტონაწილები')">
                                <img src="/public/images/assets/carpart.png" height="25" width="25">
                                პრიუსის ავტონაწილები
                            </div>
                            <div class="header__input-searched-wrapper" (click)="changeRoute('cars', 'ავტომანქანები')">
                                <img src="/public/images/assets/carpart5.png" height="25" width="25">
                                ავტომანქანები
                            </div>
                        </div>
                        <div class="header__input-col">
                            <div class="header__input-searched-wrapper" (click)="changeRoute('discounted', 'ფასდაკლებები')">
                                <img src="/public/images/assets/discount.png" height="25" width="25">
                                ფასდაკლებები
                            </div>
                            <div class="header__input-searched-wrapper" (click)="changeRoute('popular', 'პოპულარულები')">
                                <img src="/public/images/assets/popular.png" width="25" height="25">
                                პოპულარულები
                            </div>
                        </div>
                    </div>
                </div>


            
          </div>
          </div>
        `
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    }

    set changeInput(word) {
       if(this.word !== word) {
        this.word = word;
        this.searchByWord();
    
       }
    }

    async searchByWord() {
        try {
            this.loaded = false;
            this.loadNum = 0;
            this.handleLoadingState();
            this.products = (await this.httpService.searchByWord(this.word, this.offset)).response;
            console.log(this.products);
            this.loaded = true;
            this.handleLoadingState();
            if(this.products.length === 0) this.handleLoadingState();
            if(this.products.length !== 0) this.renderList();
            
        } catch(err) {
            console.log('not found');
        }
    }

    renderList() {
        this.listContainer.innerHTML = '';
        this.products.forEach((item,index) => {
            const listItem = document.createElement("a");
            listItem.classList.add("header__input-list-item");
            listItem.setAttribute("tabindex", '0');
            listItem.href = `/${this.lng}/product/${item.id}`
            console.log(listItem)
            listItem.setAttribute("data-link", '')
            listItem.addEventListener("click", () => this.detach());

            const img = document.createElement("img");
            img.classList.add("header__input-list-img");
            img.src = `${url}${item.images[0]}`;
           
            img.addEventListener("load", () => this.loadOne(index));
            img.addEventListener("error", () => this.loadOne(index));

            const content = document.createElement("span");
            content.classList.add("header__input-list-content");
            const title = document.createElement("h4");
            title.classList.add("header__input-list-title");
            title.textContent = `${item.nameGeo}`;
            
            const price = document.createElement("p");
            price.classList.add("header__input-list-price");
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
         this.headerInputBox.appendChild(this.listContainer);
         this.listContainer.style.display = 'block';
    }

    attach() {
        this.parent.appendChild(this.element);
    }
    design() {
        this.headerInputBox.style.display = 'block';
        this.headerInput.style.borderRadius = '0.5rem 0.5rem 0 0';
        this.headerInput.style.borderBottom = '1px solid var(--main-color)';
        document.addEventListener("click", this.handleOutsideClick);
    }

    handleOutsideClick(ev) {
        console.log(ev)
        console.log(this.headerInputBox);
        console.log(this.headerInput)
        const inside = ev.composedPath().some(el => {
            return [this.headerInputBox, this.headerInput].includes(el);
        });
        if (!inside) {
            this.detach();
        }
    }

    loadOne(index) {}
    
    detach() {
        document.removeEventListener("click", this.handleOutsideClick);
        this.headerInput.style.borderRadius = '1rem';
        this.headerInput.style.border = '1px solid #e5e7f1';
        this.parent.removeChild(this.element)
        this.notifier.dispatchEvent(new CustomEvent("detach", {}));
        this.headerInput.value = '';
    }

    handleLoadingState() {
        if(this.loaded && this.products.length === 0) {
            this.listContainer.style.display = 'none';
            this.spinnerContainer.style.display = 'none';
            this.notExistContainer.style.display = 'block';
        } else if(this.loaded && this.products.length > 0) {
            this.listContainer.style.display = 'block';
            this.spinnerContainer.style.display = 'none';
            this.notExistContainer.style.display = 'none';
        } else {
            this.listContainer.style.display = 'none';
            this.spinnerContainer.style.display = 'block';
            this.notExistContainer.style.display = 'none';
        }
    }

}