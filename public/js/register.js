import overlayService from "./services/overlay.js";
import authService from "./services/auth.js";
import httpService from "./services/http.js";
export class Register {
    constructor(store) {
        this.httpService = httpService;
        this.authService = authService;
        this.overlayService = overlayService;
        this.close$ = document.createElement("div");
        this.submit$ = document.createElement("div");
        this.loaded = false;    
        this.store = store;  
        this.element = this._createElement();
        this.contentContainer = this.element.querySelector(".auth-content-container");
        this.errorMessage = this.element.querySelector(".error-message");
        this.validatePasswords = this.validatePasswords.bind(this);
        this.formGroup = {
          firstName:this.element.querySelector("#user-fname-input"),
          lastName:this.element.querySelector("#user-lname-input"),
          email:this.element.querySelector("#user-mail-input"),
          password:this.element.querySelector("#user-pass-input"),
          repassword:this.element.querySelector("#user-repass-input"),
        }
        //this.fetchData();
        this.formGroup.repassword.addEventListener("input", this.validatePasswords);
    }
    /*

    async fetchAndRender() {
      this.store = await this.httpService.fetchStore('register');
      this.element = this._createElement();
      this.errorMessage = this.element.querySelector(".error-message");
      this.validatePasswords = this.validatePasswords.bind(this);
      this.contentContainer = this.element.querySelector(".auth-content-container");
      this.spinnerContainer = this.element.querySelector(".spinner-container");
      this.formGroup = {
        firstName:this.element.querySelector("#user-fname-input"),
        lastName:this.element.querySelector("#user-lname-input"),
        email:this.element.querySelector("#user-mail-input"),
        password:this.element.querySelector("#user-pass-input"),
        repassword:this.element.querySelector("#user-repass-input"),
      }
      this.formGroup.repassword.addEventListener("input", this.validatePasswords);
    }
    */
    
    _createElement() {
        const template = `
               <div class="auth-container">
    <div class="auth-content-container">
        <div class="auth__header-wrapper">
          <div class="auth__header">
            <span>${this.store.register}</span>
            <i class="material-symbols-outlined" style="display:none;">maximize</i>
            <button class="button button-icon" id="register__close-button">
              <i class="material-symbols-outlined">close</i>
            </button>
          </div>
        </div>
        <div class="auth__body">
           <div class="toaster slide-down">
             
           </div>
           <div class="form">
             <div class="auth-input-wrapper">
               <label for="user-mail" class="input-label">${this.store.name}</label>
               <div class="input-wrapper">
                 <input type="text" id="user-fname-input" class="auth-input" autocomplete="off">
                 <div class="input-group-append">
                   <i class="material-symbols-outlined">person</i>
                 </div>
               </div>
             </div>
             <div class="auth-input-wrapper">
               <label for="user-mail" class="input-label">${this.store.surname}</label>
               <div class="input-wrapper">
                 <input type="text" id="user-lname-input" class="auth-input" autocomplete="off">
                 <div class="input-group-append">
                   <i class="material-symbols-outlined">person</i>
                 </div>
               </div>
             </div>
             <div class="auth-input-wrapper">
               <label for="user-mail" class="input-label">${this.store.email}</label>
               <div class="input-wrapper">
                 <input type="text" id="user-mail-input" class="auth-input">
                 <div class="input-group-append">
                   <i class="material-symbols-outlined">email</i>
                 </div>
               </div>
             </div>
             <div class="auth-input-wrapper">
               <label for="user-mail" class="input-label">${this.store.password}</label>
               <div class="input-wrapper">
                 <input type="password" id="user-pass-input" class="auth-input" autocomplete="off">
                 <div class="input-group-append">
                   <i class="material-symbols-outlined">lock</i>
                 </div>
               </div>
             </div>
             <div class="auth-input-wrapper">
               <label for="user-mail" class="input-label">${this.store.repeatPassword}</label>
               <div class="input-wrapper">
                 <input type="password" id="user-repass-input" class="auth-input" autocomplete="off">
                 <div class="input-group-append">
                   <i class="material-symbols-outlined">lock</i>
                 </div>
               </div>
             </div>
             <div class="error-message" style="display:none;">*${this.store.passwordError}</div>
             <button class="button button-success auth-button" id="register__register-button">
                ${this.store.register}
             </button>
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
      this.store = await this.httpService.fetchStore('register');
      console.log(this.store);
      this.loaded = true;
      this.updateUI();
      this.loadingState();
    }

    updateUI() {
      this.formGroup.firstName.textContent = this.store.name;
      this.formGroup.lastName.textContent = this.store.surname;
      this.formGroup.email.textContent = this.store.email;
      this.formGroup.password.textContent = this.store.password;
      this.formGroup.repassword.textContent = this.store.repeatPassword;
      /*
      this.headerTitle.textContent = this.store.authorization;
      this.userLabel.textContent = this.store.user;
      this.passwordLabel.textContent = this.store.password;
      this.renewSuggest.textContent = this.store['forgot-password'];
      this.authButton.textContent = this.store.authorization;
      this.regButton.textContent = this.store.register;
      this.userMail.placeholder = this.store.userPlaceholder;
      this.userPassword.placeholder = this.store.passwordPlaceholder;
      */
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
        this.closeButton = this.element.querySelector("#register__close-button");
        this.registerButton = this.element.querySelector("#register__register-button");
        this.closeButton.addEventListener("click", () => {
            this.close$.dispatchEvent(new CustomEvent("closed"));
        })
        this.registerButton.addEventListener("click", () => {
            let registerUser = {};
            for (const key in this.formGroup) {
              if (Object.hasOwnProperty.call(this.formGroup, key) && key !== 'repassword') {
                  const input = this.formGroup[key];
                  registerUser[key] = input.value;
              }
            }
            if(!this.error) {
              this.overlayService.openGlobalSpinner();
              this.authService.register(registerUser).then(_ => {
                this.overlayService.closeGlobalSpinner();
                this.submit$.dispatchEvent(new CustomEvent("submited"));
              }).catch(_ => {
                this.overlayService.closeGlobalSpinner();
              })
            }
        })
    }

    validatePasswords() {
      let password = this.formGroup.password.value;
      let repassword = this.formGroup.repassword.value;
      console.log(password)
      console.log(repassword)
      if(password === repassword) {
        this.errorMessage.style.display = 'none';
        this.error = false;
      } else {
        console.log('!=')
        this.errorMessage.style.display = 'block';
        this.error = true;
      }
    }

    detach() {

    }
}