import lng from "../utils/language.js";
import { sub } from "../utils/shared.js";

export class SubmenuMob {
    constructor(products) {
        this.lng = lng();
        this.products = products;
        this.closed = document.createElement("div");
        this.selected = document.createElement("div");
        this.loaded = false;
        this.element = this._createElement();
        this.closeButton = this.element.querySelector(".menu-submob__close");
        this.closeButton.addEventListener("click", () => {
            this.closed.dispatchEvent(new CustomEvent("closed"))
        })
        this.renderList();
    }


    _createElement() {
        const template = `
        <div class="menu-mob__container">
          <div class="menu-mob__header">
            <div class="menu-mob__title">
            ქვე-მენიუ
            </div>
             <button class="button button-icon menu-submob__close">
               <i class="material-symbols-outlined">close</i>
             </button>
          </div>
          <div class="submenu-mob__list">
          </div>
          <div class="menu-mob__contact">
          </div>

        </div>
        <div class="menu-mob__spinner">
          Loading...
        </div>
        `
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild
    }

    renderList() {
        const listElement = this.element.querySelector(".submenu-mob__list");
        this.products.forEach((item,index) => {
            item.images.forEach(year => {
                const listItem = document.createElement("a");
                listItem.href = `/${this.lng}/category?yearId=${year.id}&categoryId=${item.id}&page=1`
                listItem.setAttribute("data-link", '')
                listItem.classList.add("header__input-list-item");
                listItem.setAttribute("tabindex", '0');
                listItem.addEventListener("click", (ev) => {
                    console.log(1)
                    this.selected.dispatchEvent(new CustomEvent("selected"));
                })
                console.log(item)
                const img = document.createElement("img");
                img.classList.add("header__input-list-img");
                img.src = `${sub}${year.imageUrl}`;
                img.addEventListener("load", () => this.loadOne(index));
                img.addEventListener("error", () => this.loadOne(index));
    
                const content = document.createElement("span");
                content.classList.add("header__input-list-content");
                const title = document.createElement("h4");
                title.classList.add("header__input-list-title");
                title.textContent = `${item.name}`;
                content.appendChild(title);
                listItem.appendChild(img);
                listItem.appendChild(content);
                listElement.appendChild(listItem);
            })
         })
         listElement.style.display = 'block';


    }

    loadOne(i) {}

}