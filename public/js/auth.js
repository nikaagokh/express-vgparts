import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from "./services/auth.js";
import overlayService from "./services/overlay.js";
import toastService from "./services/toast.js";
import httpService from "./services/http.js";
import lng from "../utils/language.js";
import cookieService from "./services/cookies.js";
export class Auth {
  constructor(store) {
    this.store = store;
    this.overlayService = overlayService;
    this.toastService = toastService;
    this.httpService = httpService;
    this.cookieService = cookieService;
    this.reg$ = document.createElement("div");
    this.auth$ = document.createElement("div");
    this.renew$ = document.createElement("div");
    this.close$ = document.createElement("div");
    this.loaded = false;
    this.element = this._createElement();
    this.userMail = this.element.querySelector('#user-mail-input');
    this.userPassword = this.element.querySelector("#user-password-input");
    this.contentContainer = this.element.querySelector(".auth-content-container");
    this.spinnerContainer = this.element.querySelector(".spinner-container");
    this.userLabel = this.element.querySelector('.user-label');
    this.passwordLabel = this.element.querySelector('.password-label');
    this.renewSuggest = this.element.querySelector('.auth__renew-suggest');
    this.authButton = this.element.querySelector("#auth__authorization-button");
    this.regButton = this.element.querySelector("#auth__register-button");
    this.closeButton = this.element.querySelector("#auth__close-button");
    this.headerTitle = this.element.querySelector(".auth__header-title");
    this.listeners();
  }
  _createElement() {
    const template = `
          <div class="auth-container">
    <div class="auth-content-container">
        <div class="auth__header-wrapper">
            <div class="auth__header">
                <div class="auth__header-title">${this.store.authorization}</div>
                <i class="material-symbols-outlined" style="display:none;">maximize</i>
                <button class="button button-icon" id="auth__close-button">
                    <i class="material-symbols-outlined">close</i>
                </button>
            </div>
        </div>
        <div class="auth__body">
            <div class="form">
                <div class="auth-input-wrapper">
                    <label for="user-mail" class="input-label user-label">${this.store.user}</label>
                    <div class="input-wrapper">
                        <input type="text" id="user-mail-input" class="auth-input">
                        <div class="input-group-append">
                            <i class="material-symbols-outlined">person</i>
                        </div>
                    </div>
                </div>
                <div class="auth-input-wrapper">
                    <label for="user-mail" class="input-label password-label">${this.store.password}</label>
                    <div class="input-wrapper">
                        <input type="password" id="user-password-input" class="auth-input">
                        <div class="input-group-append">
                            <i class="material-symbols-outlined">lock</i>
                        </div>
                    </div>
                </div>
                <button class="button button-success auth-button" id="auth__authorization-button">${this.store.authorization}</button>
                <button class="button button-light auth-button register-button" id="auth__register-button">${this.store.register}</button>
            </div>
        </div>
    </div>
   
</div>
        `

    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = template;
    return tempContainer.firstElementChild;
  }

  async fetchData() {
    this.loaded = false;
    this.loadingState();
    this.store = await this.httpService.fetchStore('auth');
    this.mode = cookieService.getCookie('mode');
    console.log(this.element)
    this.loaded = true;
    this.updateUI();
    this.loadingState();
  }

  updateUI() {
    this.headerTitle.textContent = this.store.authorization;
    this.userLabel.textContent = this.store.user;
    this.passwordLabel.textContent = this.store.password;
    this.renewSuggest.textContent = this.store['forgot-password'];
    this.authButton.textContent = this.store.authorization;
    this.regButton.textContent = this.store.register;
    this.userMail.placeholder = this.store.userPlaceholder;
    this.userPassword.placeholder = this.store.passwordPlaceholder;
  }

  loadingState() {
    if (this.loaded) {
      this.contentContainer.style.display = 'block';
      this.spinnerContainer.style.display = 'none';
    } else {
      this.contentContainer.style.display = 'none';
      this.spinnerContainer.style.display = 'block';
    }
  }

  listeners() {
    this.closeButton.addEventListener("click", () => {
      this.close$.dispatchEvent(new CustomEvent("closed"));
    })
    this.authButton.addEventListener("click", () => {
      const userObject = { email: this.userMail.value, password: this.userPassword.value };
      this.userAuth(userObject);
      //this.auth$.dispatchEvent(new CustomEvent("auth", {detail:userObject}));
    })
    this.regButton.addEventListener("click", () => {
      this.reg$.dispatchEvent(new CustomEvent("reg"));
    })
  }

  detach() {
    //detach logic
  }

  userAuth(userObject) {
    this.overlayService.openGlobalSpinner();
    fetch("/api/user/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userObject)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("error occured");
        }
        return response.json();
      })
      .then(x => {
        localStorage.setItem(JWT_ACCESS_TOKEN, x.accessToken);
        localStorage.setItem(JWT_REFRESH_TOKEN, x.refreshToken);
        this.overlayService.closeGlobalSpinner();
        this.toastService.createSuccessToast('თქვენ წარმატებით გაიარეთ აუტორიზაცია');
        this.close$.dispatchEvent(new CustomEvent("closed"));
      }, e => {
        this.overlayService.closeGlobalSpinner();
        this.toastService.createDangerToast('მომხმარებლის მეილი ან პაროლი არასწორია');
      });
  }
}