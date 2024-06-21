import overlayService from "./services/overlay.js";
import authService from "./services/auth.js";
import toastService from "./services/toast.js";
export class Verify {
    constructor() {
        this.authService = authService;
        this.overlayService = overlayService;
        this.toastService = toastService;
        this.close$ = document.createElement("div");
        this.verify$ = document.createElement("div");
        this.loaded = false;
        this.element = this._createElement();
        this.inputNumber = this.element.querySelector("#user-number-input");
        this.listeners();
    }

    _createElement() {
        const template = `
        <div class="auth-container">
        <div class="auth__header-wrapper">
          <div class="auth__header">
            ვერიფიკაცია
            <i class="material-symbols-outlined" style="display:none;">maximize</i>
            <button class="button button-icon" id="verify__close-button">
              <i class="material-symbols-outlined">close</i>
            </button>
          </div>
        </div>
        <div class="auth__body">
           <div class="toaster slide-down">
              <div class="toaster-message">
                <button class="button button-icon">
                  <i class="material-symbols-outlined">info</i>
                </button>
                <div class="toaster-content">
                მითითებულ მეილზე გამოგეგზავნათ პინ კოდი, ვერიფიკაციისთვის შეიყვანეთ კოდი
               </div>
              <div class="">
              <i class="material-symbols-outlined icon-sm">close</i>
              </div>
           
              </div>
           </div>
           <div class="form">
             <div class="auth-input-wrapper">
               <label for="user-mail" class="input-label">პინ კოდი</label>
               <div class="input-wrapper">
                 <input type="text" id="user-number-input" class="auth-input" autocomplete="off">
                 <div class="input-group-append">
                   <i class="material-symbols-outlined">offline_pin</i>
                 </div>
               </div>
             </div>
             <button class="button button-success auth-button" id="verify__verify-button">
                ვერიფიკაცია
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
        this.closeButton = this.element.querySelector("#verify__close-button");
        this.verifyButton = this.element.querySelector("#verify__verify-button");
        this.closeButton.addEventListener("click", () => {
            this.close$.dispatchEvent(new CustomEvent("closed"));
        })
        this.verifyButton.addEventListener("click", () => {
            this.overlayService.openGlobalSpinner();
            const number = this.inputNumber.value;
            console.log(number);
            this.authService.verifyUser(number)
            .then(x => {
                this.error = false;
                this.verify$.dispatchEvent(new CustomEvent('verified'));
                this.overlayService.closeGlobalSpinner();
            })
            .catch(err => {
              this.error = true;
              this.overlayService.closeGlobalSpinner();
              this.toastService.createDangerToast('პინკოდი არასწორია');
            })
            //this.verify$.dispatchEvent(new CustomEvent("verified"));
        })
    }

    detach() {}
}