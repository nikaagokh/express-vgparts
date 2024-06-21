import { Auth } from "../auth.js";
import { Filtera } from "../filtera.js";
import { enableScroll } from "../../utils/enableScroll.js";
import { disableScroll } from "../../utils/disableScroll.js";
import { Register } from "../register.js";
import { Verify } from "../verify.js";
import { ImageZoom } from "../imagezoom.js";
import toastService from "./toast.js";
import { MenuMob } from '../menumob.js';
import { SubmenuMob } from "../submenumob.js";
import { MiniCart } from "../minicart.js";
import { SearchMob } from "../searchmob.js";
import { MiniCartMob } from "../minicartmob.js";
class OverlayService {
    constructor() {
        this.toastService = toastService;
        this.spinner = null;
        this.globalSpinnerWrapper = null;
        this.globalSpinnerBackdrop = null;
        this.menuRef = null;
        this.submenuRef = null;
        this.searchMob = null;
        this.cartOverlay = null;
        this.authOverlay = null;
        this.registerOverlay = null;
        this.overlayContainer = document.querySelector(".overlay-container");
        this.spinnerTemplate = `<svg class="spinner" width="35px" height="35px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                                   <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                                </svg>`;
        this.mobsize = !window.matchMedia("(min-width:992px)").matches;
        window.matchMedia("(min-width:992px)").addEventListener("change", (mq) => {
            if(mq.matches) {
                this.mobsize = false;
            } else {
                this.mobsize = true;
            }
        });
    }

    openGlobalSpinner() {
        if(!this.globalSpinnerBackdrop && !this.globalSpinnerWrapper) {
            this.globalSpinnerWrapper = document.createElement("div");
            const spinnerWrapper = document.createElement("div");
            spinnerWrapper.classList.add("spinner-wrapper")
            this.globalSpinnerWrapper.classList.add("overlay-wrapper");
            this.globalSpinnerWrapper.classList.add("overlay-wrapper-dialog")
            this.globalSpinnerBackdrop = document.createElement("div");
            this.globalSpinnerBackdrop.classList.add("dialog-backdrop");
            spinnerWrapper.innerHTML = this.spinnerTemplate;
            this.globalSpinnerWrapper.appendChild(spinnerWrapper);

            this.globalSpinnerBackdrop.addEventListener("click", () => {
                this.overlayContainer.removeChild(this.globalSpinnerBackdrop);
                this.overlayContainer.removeChild(this.globalSpinnerWrapper);
                this.globalSpinnerBackdrop = null;
                this.globalSpinnerWrapper = null;
            })
            this.overlayContainer.appendChild(this.globalSpinnerWrapper);
            this.overlayContainer.appendChild(this.globalSpinnerBackdrop);


        }
    }

    closeGlobalSpinner() {
        if(this.globalSpinnerWrapper && this.globalSpinnerBackdrop) {
            this.overlayContainer.removeChild(this.globalSpinnerBackdrop);
            this.overlayContainer.removeChild(this.globalSpinnerWrapper);
            this.globalSpinnerBackdrop = null;
            this.globalSpinnerWrapper = null;
        }
    }

    openSpinner(parent) {
        if(!this.spinner) {
            this.spinner = new Loader();
            this.spinnerparent = parent;
            this.spinnerparent.appendChild(this.spinner.element);
        }
    }

    closeSpinner() {
        if(this.spinner) {
            this.spinnerparent.removeChild(this.spinner.element);
            this.spinner = null;
            this.spinnerparent = null;
        }
    }

    createDialog() {
        const globalWrapper = document.createElement("div");
        globalWrapper.classList.add("overlay-wrapper");
        globalWrapper.classList.add("overlay-wrapper-dialog");
        const dialogBackdrop = document.createElement("div");
        dialogBackdrop.classList.add("dialog-backdrop");
        const dialogComponent = document.createElement("div"); 
        return {globalWrapper, dialogBackdrop, dialogComponent};
    }

    async openFilter() {
        if(this.mobsize) {
            const store = await this.fetchStore('filter');
            const {globalWrapper, bottomBackdrop, bottomComponent} = this.createBottom();
            this.filterOverlay = new Filtera(store);
            bottomComponent.appendChild(this.filterOverlay.element);
            globalWrapper.appendChild(bottomComponent);
            this.overlayContainer.appendChild(globalWrapper);
            this.overlayContainer.appendChild(bottomBackdrop);
            disableScroll();
            this.filterOverlay.close$.addEventListener("closed", () => {
                this.filterOverlay = null;
                bottomComponent.classList.add("slide-back");
                setTimeout(() => {
                    globalWrapper.remove();
                    bottomBackdrop.remove();
                    enableScroll();
                },200);
            })

            bottomBackdrop.addEventListener("click", () => {
                this.filterOverlay = null;
                bottomComponent.classList.add("slide-back");
                setTimeout(() => {
                    globalWrapper.remove();
                    bottomBackdrop.remove();
                    enableScroll();
                },200);
            })
            
        } else {
            const store = await this.fetchStore('filter');
            const {globalWrapper, dialogBackdrop, dialogComponent} = this.createDialog();
            const filter = new Filtera(store);
            dialogComponent.appendChild(filter.element);
            dialogComponent.classList.add("overlay-pane");
            dialogComponent.classList.add("dialog-size");
            globalWrapper.appendChild(dialogComponent)
            disableScroll();
            this.overlayContainer.appendChild(globalWrapper);
            this.overlayContainer.appendChild(dialogBackdrop);
            //filter.listeners();
            dialogBackdrop.addEventListener("click", () => {
                filter.detach();
                globalWrapper.remove();
                dialogBackdrop.remove();
                enableScroll()
            })
            filter.close$.addEventListener("closed", () => {
                console.log(1)
                filter.detach();
                globalWrapper.remove();
                dialogBackdrop.remove();
                enableScroll()
            })
        }
    }

    async openCart() {
        if(!this.mobsize) {
            if(!this.cartOverlay) {
                const store = await this.fetchStore('minicart');
                this.cartOverlay = new MiniCart(store);
    
                this.cartOverlay.close$.addEventListener("closed", () => {
                    this.cartOverlay = null;
                })
                
            } else {
                this.cartOverlay.detach();
                this.cartOverlay = null;
            }
        } else {
            if(!this.cartOverlay) {
                const store = await this.fetchStore('minicart');
                const {globalWrapper, bottomBackdrop, bottomComponent} = this.createBottom();
                this.cartOverlay = new MiniCartMob(store);
                bottomComponent.appendChild(this.cartOverlay.element);
                globalWrapper.appendChild(bottomComponent);
                this.overlayContainer.appendChild(globalWrapper);
                this.overlayContainer.appendChild(bottomBackdrop);
                disableScroll();
                bottomBackdrop.addEventListener("click", () => {
                    this.cartOverlay = null;
                    bottomComponent.classList.add("slide-back");
                    setTimeout(() => {
                        globalWrapper.remove();
                        bottomBackdrop.remove();
                        enableScroll();
                    },200);
                })

                this.cartOverlay.close$.addEventListener("closed", () => {
                    this.cartOverlay = null;
                    bottomComponent.classList.add("slide-back");
                    setTimeout(() => {
                        globalWrapper.remove();
                        bottomBackdrop.remove();
                        enableScroll();
                    }, 200);
                })
            }
        }
    }

    async openSearchMob() {
        if(this.mobsize) {
            if(!this.searchMob) {
                const store = await this.fetchStore('searchmob');
                const searchWrapper = document.createElement("div");
                searchWrapper.classList.add('searchMob', 'overlay-pane');
                this.searchMob = new SearchMob(store);
                disableScroll();

                searchWrapper.appendChild(this.searchMob.element); 
                this.overlayContainer.appendChild(searchWrapper);

                this.searchMob.close$.addEventListener("closed", () => {
                    this.searchMob = null;
                    searchWrapper.remove();
                    enableScroll();
                })
            } else {
                this.searchMob.detach();
                this.searchMob = null;
            }
         } else {
            this.focusInput();
         }
    }

    async openAuth() {
        if(!this.mobsize) {
            if(!this.authOverlay) {

                const store = await this.fetchStore('auth'); 
                const {globalWrapper:authGlobalWrapper, dialogBackdrop:authDialogBackdrop, dialogComponent:authDialogComponent} = this.createDialog();
                this.authOverlay = new Auth(store);
                authDialogComponent.appendChild(this.authOverlay.element);
                authDialogComponent.classList.add("overlay-pane");
                authDialogComponent.classList.add("dialog-size");
                authGlobalWrapper.appendChild(authDialogComponent)
                disableScroll();
                this.overlayContainer.appendChild(authGlobalWrapper);
                this.overlayContainer.appendChild(authDialogBackdrop);
                authDialogBackdrop.addEventListener("click", () => {
                    this.authOverlay.detach();
                    this.authOverlay = null;
                    authGlobalWrapper.remove();
                    authDialogBackdrop.remove();
                    enableScroll();
                })
        
                this.authOverlay.close$.addEventListener("closed", () => {
                    this.authOverlay.detach();
                    this.authOverlay = null;
                    authGlobalWrapper.remove();
                    authDialogBackdrop.remove();
                    enableScroll()
                })
        
                this.authOverlay.reg$.addEventListener("reg", async () => {
                    const store = await this.fetchStore('register');
                    const {globalWrapper:regGlobalWrapper, dialogBackdrop:regDialogBackdrop, dialogComponent:regDialogComponent} = this.createDialog();
                    this.registerOverlay = new Register(store);
                    regDialogComponent.appendChild(this.registerOverlay.element);
                    regDialogComponent.classList.add("overlay-pane");
                    regDialogComponent.classList.add("dialog-size");
                    regGlobalWrapper.appendChild(regDialogComponent);
                    this.overlayContainer.appendChild(regGlobalWrapper);
                    this.overlayContainer.appendChild(regDialogBackdrop);
                    regDialogBackdrop.addEventListener("click", () => {
                        this.registerOverlay.detach();
                        this.registerOverlay = null;
                        this.overlayContainer.innerHTML = '';
                        enableScroll();
                    })
                    this.registerOverlay.close$.addEventListener("closed", () => {
                        this.registerOverlay.detach();
                        this.registerOverlay = null;
                        regGlobalWrapper.remove();
                        regDialogBackdrop.remove();
                    })
                    this.registerOverlay.submit$.addEventListener("submited", () => {
                        this.registerOverlay.detach();
                        this.registerOverlay = null;
                        this.authOverlay.detach();
                        this.authOverlay = null;
                        regGlobalWrapper.remove();
                        regDialogBackdrop.remove();
                        authDialogBackdrop.remove();
                        authGlobalWrapper.remove();
                        
                        const {globalWrapper:verifyGlobalWrapper, dialogBackdrop:verifyDialogBackdrop, dialogComponent:verifyDialogComponent} = this.createDialog();
                        const verify = new Verify();
                        verifyDialogComponent.appendChild(verify.element);
                        verifyDialogComponent.classList.add("overlay-pane");
                        verifyDialogComponent.classList.add("dialog-size");
                        verifyGlobalWrapper.appendChild(verifyDialogComponent);
                        this.overlayContainer.appendChild(verifyGlobalWrapper);
                        this.overlayContainer.appendChild(verifyDialogBackdrop);
                        verifyDialogBackdrop.addEventListener("click", () => {
                            verify.detach();
                            verifyGlobalWrapper.remove();
                            verifyDialogBackdrop.remove();
                            enableScroll();
                        })
        
                        verify.close$.addEventListener("closed", () => {
                            verify.detach();
                            verifyGlobalWrapper.remove();
                            verifyDialogBackdrop.remove();
                            enableScroll();
                        })
        
                        verify.verify$.addEventListener("verified", () => {
                            this.toastService.createSuccessToast("თქვენ წარმატებით გაიარეთ რეგისტრაცია");
                            verify.detach();
                            verifyGlobalWrapper.remove();
                            verifyDialogBackdrop.remove();
                            enableScroll();
                        })
                    })
                    
                })
            } else {
                this.authOverlay.detach();
                this.authOverlay = null;
            }
        } else {
            const store = await this.fetchStore('auth'); 
            const {globalWrapper:authGlobalWrapper, bottomBackdrop:authBottomBackdrop, bottomComponent:authBottomComponent} = this.createBottom();
            this.authOverlay = new Auth(store);
            authBottomComponent.appendChild(this.authOverlay.element);
            authGlobalWrapper.appendChild(authBottomComponent)
            disableScroll();
            this.overlayContainer.appendChild(authGlobalWrapper);
            this.overlayContainer.appendChild(authBottomBackdrop);
            authBottomBackdrop.addEventListener("click", () => {
                this.cartOverlay = null;
                authBottomComponent.classList.add("slide-back");
                setTimeout(() => {
                    authGlobalWrapper.remove();
                    authBottomBackdrop.remove();
                    enableScroll();
                },200);

            })
            this.authOverlay.close$.addEventListener("closed", () => {
                this.authOverlay = null; 
                authBottomComponent.classList.add("slide-back");
                setTimeout(() => {
                    authGlobalWrapper.remove();
                    authBottomBackdrop.remove();
                    enableScroll();
                },200);
            })
            this.authOverlay.auth$.addEventListener("authed", () => {

            })
        }
    }

    async openZoom(image) {
        const store = await this.fetchStore('zoom');
        const {globalWrapper, dialogBackdrop, dialogComponent} = this.createDialog();
        const zoom = new ImageZoom(image, store);
        dialogComponent.appendChild(zoom.element);
        dialogComponent.classList.add("overlay-pane");
        dialogComponent.classList.add("dialog-size");
        globalWrapper.appendChild(dialogComponent);
        this.overlayContainer.appendChild(globalWrapper);
        this.overlayContainer.appendChild(dialogBackdrop);
        disableScroll();
        dialogBackdrop.addEventListener("click", () => {
            zoom.detach();
            globalWrapper.remove();
            dialogBackdrop.remove();
            enableScroll();
        })

        zoom.close$.addEventListener("closed", () => {
            zoom.detach();
            globalWrapper.remove();
            dialogBackdrop.remove();
            enableScroll();
        })
    }

    clearOverlay() {
        while(this.overlayContainer.firstChild) {
            this.overlayContainer.removeChild(this.overlayContainer.firstChild)
        }
    }

    async openMenu() {
        if(this.mobsize) {
            if(!this.menuRef) {
                try {
                    const {globalWrapper, overlayBackDrop} = this.createSideOverlay();
                    const response = await fetch("http://localhost:3001/api/category/full");
                    if(!response.ok) {
                        throw new Error("errr");
                    }
                    const fullCategories = (await response.json()).response;

                    this.menuRef = new MenuMob(fullCategories);
                    globalWrapper.appendChild(this.menuRef.element);
                    this.overlayContainer.appendChild(overlayBackDrop);
                    this.overlayContainer.appendChild(globalWrapper);
                    disableScroll();
                    overlayBackDrop.addEventListener("click", () => {
                        this.menuRef = null;
                        globalWrapper.classList.add("slide-out");
                        setTimeout(() => {
                            globalWrapper.remove()
                            overlayBackDrop.remove();
                            enableScroll();
                        }, 200);
                    })
    
                    this.menuRef.notifier.addEventListener("closed", () => {
                        this.menuRef = null;
                        globalWrapper.classList.add("slide-out");
                        bottomBackdrop.remove();
                        setTimeout(() => {
                            globalWrapper.remove()
                            overlayBackDrop.remove();
                            enableScroll();
                        }, 200);
                    })
    
                    this.menuRef.selected.addEventListener("selected", (ev) => {
                        if(!this.submenuRef) {
                            const {globalWrapper:submenuWrapper, overlayBackDrop:submenuBackdrop} = this.createSideOverlay();
                            this.submenuRef = new SubmenuMob(fullCategories[ev.detail].subcategories);
                            submenuWrapper.appendChild(this.submenuRef.element);
                            submenuBackdrop.classList.add("transparent-backdrop")
                            this.overlayContainer.appendChild(submenuBackdrop);
                            this.overlayContainer.appendChild(submenuWrapper);
                            submenuBackdrop.addEventListener("click", () => {
                                overlayBackDrop.remove();
                                globalWrapper.remove();
                                submenuBackdrop.remove();
                                submenuWrapper.remove();
                                this.menuRef = null;
                                this.submenuRef = null;
                                enableScroll();
                            })
                            this.submenuRef.selected.addEventListener("selected", () => {
                                
                                this.menuRef = null;
                                this.submenuRef = null;
                            })
                            this.submenuRef.closed.addEventListener("closed", () => {
                                submenuBackdrop.remove();
                                submenuWrapper.remove();
                                this.submenuRef = null;
                            })
                        }
                    })
                    
                } catch(err) {
                    console.log(err);
                }
            } else {
                this.menuRef.detach();
                this.menuRef = null;
            }
        } else {
            if(!this.menuRef) {
                try {
                    const response = await fetch("https://vgpart-production.up.railway.app/api/categories/full");
                    if(!response.ok) {
                        throw new Error("errr");
                    }
                    const fullCategories = await response.json();
                    new MenuDesktop(fullCategories);
                    
                } catch(err) {
                    console.log(err);
                }
            }
        }
    }

    createSideOverlay() {
        const globalWrapper = document.createElement("div");
        globalWrapper.classList.add("overlay-container__menu-mobile-panel");
        const randId = Math.floor(Math.random() * 900) + 100;
        globalWrapper.id = `overlay-pane-${randId}`;
        const overlayBackDrop = document.createElement("div");
        overlayBackDrop.classList.add("overlay-container__menu-mobile-backdrop");
        return {globalWrapper, overlayBackDrop};
    }
    

    async fetchStore(section) {
        const lng = this.getLanguage();
        return fetch(`http://localhost:3001/${lng}/api/lng/translate?section=${section}`)
        .then(res => {
            return res.json();
        });
    }

    getLanguage() {
        const url = window.location.pathname;
        return url.split('/')[1];
    }

    routerLink() {
        if(location.pathname === '/ka/' || location.pathname === '/en/') {
            scrollTo({top:0, behavior:'smooth'});
        } else {
            const lng = this.getLanguage();
            location.href = `/${lng}/`
        }
    }

    createDialog() {
        const globalWrapper = document.createElement("div");
        globalWrapper.classList.add("overlay-wrapper");
        globalWrapper.classList.add("overlay-wrapper-dialog");
        const dialogBackdrop = document.createElement("div");
        dialogBackdrop.classList.add("dialog-backdrop");
        const dialogComponent = document.createElement("div"); 
        dialogComponent.classList.add("overlay-pane");
        dialogComponent.classList.add("overlay-pane-dialog");
        const randId = Math.floor(Math.random() * 900) + 100;
        dialogComponent.id = `overlay-pane-${randId}`;
        return {globalWrapper, dialogBackdrop, dialogComponent};
    }

    createSideOverlay() {
        const globalWrapper = document.createElement("div");
        globalWrapper.classList.add("overlay-container__menu-mobile-panel");
        const randId = Math.floor(Math.random() * 900) + 100;
        globalWrapper.id = `overlay-pane-${randId}`;
        const overlayBackDrop = document.createElement("div");
        overlayBackDrop.classList.add("overlay-container__menu-mobile-backdrop");
        return {globalWrapper, overlayBackDrop};
    }

    createFullOverlay() {
        const globalWrapper = document.createElement("div");
        globalWrapper.classList.add("overlay-container__full")
    }

    createBottom() {
        const globalWrapper = document.createElement("div");
        globalWrapper.classList.add("overlay-wrapper");
        globalWrapper.classList.add("overlay-wrapper-bottom");
        const bottomBackdrop = document.createElement("div");
        bottomBackdrop.classList.add("dialog-backdrop");
        const bottomComponent = document.createElement("div");
        bottomComponent.classList.add("overlay-pane");
        bottomComponent.classList.add("overlay-pane-bottom");
        const randId = Math.floor(Math.random() * 900) + 100;
        bottomComponent.id = `overlay-pane-${randId}`;
        return {globalWrapper, bottomBackdrop, bottomComponent};
    }

    focusInput() {
        const inp = document.querySelector('.header__input-search');
        inp.focus();
    }


}

const overlayService = new OverlayService();
export default overlayService;