import { caturl } from "../utils/shared.js";

export class MenuMob {
    constructor(products) {
        this.products = products;
        console.log(this.products);
        this.notifier = document.createElement("div");
        this.selected = document.createElement("div");
        this.loaded = false;
        this.element = this._createElement();
        this.closeButton = this.element.querySelector(".menu-mob__close");
        this.menuList = this.element.querySelector(".menu-mob__list");
        this.renderList();
        this.closeButton.addEventListener("click", () => {
            this.notifier.dispatchEvent(new CustomEvent("closed"));
        });
    }

    initContainer() {
        const menuMob = document.createElement("div");
        const menuMobBackdrop = document.createElement("div");

        menuMob.classList.add("overlay-container__menu-mobile-panel"); 
        menuMobBackdrop.classList.add("overlay-container__menu-mobile-backdrop");

        this.overlayContainer.appendChild(menuMobBackdrop);
        this.overlayContainer.appendChild(menuMob);
    }

    closeComponent(route) {
        const customEv = new CustomEvent("submenu", {detail:3});
        this.notifier.dispatchEvent(customEv);
        /*
        if(route) {
            //change route
            this.menuList.innerHTML = '';
        } else {
            this.menuMobContainer.classList.add("slide-out");
            
        }
        */
    }
    async fetchData() {
        try {
            this.products = await fetch('https://fakestoreapi.com/products?limit=12').then(resp => resp.json());
            this.isLoading = false;
            this._updateElement();

        } catch(err) {
            console.log(err);
        }
    }

    _createElement() {
        const template = `
        <div class="menu-mob__container">
          <div class="menu-mob__header">
            <div class="menu-mob__title">
            მენიუ
            </div>
             <button class="button button-icon menu-mob__close">
               <i class="material-symbols-outlined">close</i>
             </button>
          </div>
          <div class="menu-mob__list"></div>
          <div class="menu-mob__contact"></div>

        </div>
        <div class="menu-mob__spinner">
          Loading...
        </div>
        `
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = template;
        //this.menuMobContainer.appendChild(tempContainer.firstElementChild);
        //this.menuMobContainer.appendChild(tempContainer.lastElementChild)
        return tempContainer.firstElementChild
    }

    _updateElement() {
        
        const container = this.menuMobContainer.querySelector('.menu-mob__container');
        const spinner = this.menuMobContainer.querySelector('.menu-mob__spinner');
        
        if (this.isLoading) {
            container.style.display = 'none'; 
            spinner.style.display = 'block'; 
        } else {
            container.style.display = 'block';
            spinner.style.display = 'none'; 
        }

        this.renderList();
    }

    renderList() {
        const listElement = this.element.querySelector(".menu-mob__list");
        this.products.forEach((item,index) => {
            const listItem = document.createElement("div");
            //listItem.href = `/subcategory?id=${this.products[index].id}&category=${item.name}`
            //listItem.setAttribute("data-link", '')
            listItem.classList.add("header__input-list-item");
            listItem.setAttribute("tabindex", '0');
            listItem.addEventListener("click", (ev) => {
                console.log(1)
                //this.notifier.dispatchEvent(new CustomEvent("closed"))
                this.selected.dispatchEvent(new CustomEvent("selected", {detail:index}))
            })
            console.log(item)
            const img = document.createElement("img");
            img.classList.add("header__input-list-img");
            img.src = `${caturl}${item.image}`;
            img.addEventListener("load", () => this.loadOne(index));
            img.addEventListener("error", () => this.loadOne(index));

            const content = document.createElement("span");
            content.classList.add("header__input-list-content");
            const title = document.createElement("h4");
            title.classList.add("header__input-list-title");
            title.textContent = `${item.name}`;
            /*
            const price = document.createElement("p");
            price.classList.add("header__input-list-price");
            price.textContent = `${Mat}`;
            */
            content.appendChild(title);
            listItem.appendChild(img);
            listItem.appendChild(content);
            listElement.appendChild(listItem);
         })
         listElement.style.display = 'block';


    }

    handleItemClick(v) {}
    loadOne(i) {}

}