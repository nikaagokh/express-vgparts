import cookieService from "./services/cookies.js";
import httpService from "./services/http.js";
import authService from "./services/auth.js";
import overlayService from "./services/overlay.js";
import toastService from "./services/toast.js";
import { MiniCart } from "./minicart.js";
import { MenuDesktop } from "./menudesktop.js";
import { SearchBox } from "./searchbox.js";
export class Header {
    constructor() {
        this.overlayService = overlayService;
        this.toastService = toastService;
        this.cookieService = cookieService;
        this.auth = authService;
        this.httpService = httpService;
        this.searchBox = null;
        this.cartOverlay = null;
        this.categoryOverlay = null;
        this.languageOverlay = null;
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.element = document.querySelector(".header");
        this.headerCategory = document.querySelector(".header__category-desktop");
        this.headerCategoryMob = document.querySelector(".header__category-mobile");
        this.headerFilter = document.querySelectorAll("#headerFilter");
        this.headerFavorite = document.querySelectorAll("#headerFavorite");
        this.headerCart = document.querySelectorAll("#headerCart");
        this.headerUser = document.querySelectorAll("#headerUser");
        this.badgeFavorite = document.querySelector("#badgeFavorite");
        this.badgeCart = document.querySelector("#badgeCart");
        this.headerInput = document.querySelector(".header__input-search");
        this.headerSearch = document.querySelector('.header__input-search-icon');
        this.headerInputBox = document.querySelector(".header__input-box");
        this.listContainer = document.querySelector(".header__input-box-list");
        this.spinnerContainer = document.querySelector(".header__input-spinner");
        this.notExistContainer = document.querySelector(".header__input-not-exist-wrapper");
        this.languageButton = document.querySelector(".language-changer");
        this.languageList = document.querySelector(".language-list");
        this.themeContainer = document.querySelector('#checkbox');
        this.themeContainer.addEventListener("change", () => {
            this.cookieService.toggleMode();
        })
        this.headerSearch.addEventListener("click", () => {
            this.overlayService.openSearchMob();
        })
        this.headerInput.addEventListener("input", this.debounce(this.handleInputDebounced,500));
        this.headerFilter.forEach(filter => {
            filter.addEventListener("click", () => {
                this.overlayService.openFilter();
            })
        });
        this.headerFavorite.forEach(icon => {
            
            icon.addEventListener("click", (ev) => {
                this.auth.isAuthenticated().then(response => {
                    if(!response) {
                        this.toastService.showToast("თქვენ არ ხართ ავტორიზებული, გთხოვთ გაიაროთ რეგისტრაცია ან ავტორისზაცია");
                    } else {
                        /*
                        const favorite = new Favorites();
                        favorite.cart$.addEventListener("cart", (ev) => {
                            // add to cart
                        })
                        favorite.buy$.addEventListener("buy", (ev) => {
                            // buy
                        })
                        */
                        
                    }
                })
                //overlayService.openGlobalSpinner()
                
            })
            
           

        })
    
        this.headerCart.forEach(icon => {
            icon.addEventListener("click", () => {
                this.overlayService.openCart();
            })
        });
        this.headerUser.forEach(user => {
            user.addEventListener("click", () => {
                this.overlayService.openAuth();
                
            })
        });

        this.headerCategory.addEventListener("click", async () => {
            if(!this.categoryOverlay) {
                try {
                    const response = await fetch("http://localhost:3001/api/category/full");
                    if(!response.ok) {
                        throw new Error("errr");
                    }
                    
                    const fullCategories = (await response.json()).response;
                    this.categoryOverlay = new MenuDesktop(fullCategories);
                    this.categoryOverlay.closed$.addEventListener("closed", () => {
                        this.categoryOverlay = null;
                    })
                } catch(err) {
                    console.log(err);
                }
            } else {
                this.categoryOverlay.detach();
                this.categoryOverlay = null;
            }
        })
        this.headerCategoryMob.addEventListener("click", () => {
            console.log(1);
            this.overlayService.openMenu();
         })
       this.httpService.cartProducts$.subscribe(cartObject => {
        console.log(cartObject)
        if(cartObject.products.length > 0) {
            this.cartProductsQuantity = cartObject.products?.reduce((acc, curr) => {
                return acc + curr.quantity;
            }, 0)
        } else {
            this.cartProductsQuantity = 0;
        }
        this.badgeCart.textContent = this.cartProductsQuantity;
       })
       
       this.languageButton.addEventListener("click", () => {
        if(this.languageOverlay === null) {
            this.languageOverlay = this.languageList;
            this.languageList.classList.toggle('ul-active');
            setTimeout(() => document.addEventListener("click", this.handleOutsideClick), 0);
        } else {
            this.detachLanguage();
        }
       })
       
    }

    detachLanguage() {
        this.languageOverlay = null;
        this.languageList.classList.toggle('ul-active');
        document.removeEventListener("click", this.handleOutsideClick);
    }

    handleOutsideClick(ev) {
        const inside = ev.composedPath().some(el => {
            return this.languageList === el
        });
        if (!inside) {
            this.detachLanguage();
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
        if (word.length !== 0) {
          if (this.searchBox === null) {
            this.createOverlay(word);
          } else {
            this.changeOverlayInput(word);
          }
        } else {
          this.searchBox.detach();
          this.searchBox = null;

        }
    }

    createOverlay(word) {
        
        this.searchBox = new SearchBox();
        this.searchBox.changeInput = word;
        this.searchBox.notifier.addEventListener("detach", () => {
            this.searchBox = null;
        })
        
    }

    changeOverlayInput(word) {
        
        this.searchBox.changeInput = word;
        
    }

}