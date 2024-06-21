export class Chat {
    constructor() {
        this.element = this._createElement();
        this.messagesContainer = this.element.querySelector("#messagesContainer");
        this.spinnerContainer = this.element.querySelector('.chat-spinner');
        document.querySelector(".overlay-container").appendChild(this.element);
        this.fetchData();   
    }

    fetchData() {
        this.loaded = false;
        this.handleLoadingState();
        setTimeout(() => {
            this.messages = [{date:'20.04', messages:[{sent:true, last:false, content:'abc', time:'12:00'}]}, {date:'20.04', messages:[{sent:true, last:false, content:'abc', time:'12:00'}]}, {date:'20.04', messages:[{sent:true, last:false, content:'abc', time:'12:00'}]}];
            this.renderMessages();
            this.loaded = true;
            this.handleLoadingState();
        }, 3000);
    }

    renderMessages() {
        const template = `
          ${this.messages.map(item => `
             <div class="chat-date">${item.date}</div>
             ${item.messages.map(message => `
                 <div class="message-wrapper slide-up" [class.send]="message.sent" [class.sendlast]="message.last && message.sent" [class.receive]="!message.sent" [class.receivelast]="message.last && !message.sent">
                    <div class="text-wrapper">${message?.content}</div>
                    <div class="message-inf">
                        <span>${message?.time}</span>
                        <div class="check-container">
                            ${message.sent ? `
                                 <i class="material-symbols-outlined">check</i>
                                 <i class="material-symbols-outlined">check</i>
                            ` : ``}
                        </div>
                    </div>
                </div>
             `)}
            `)}
        `;
        this.messagesContainer.innerHTML = template;
    }

    handleLoadingState() {
        if(this.loaded && this.messages.length > 0) {
            this.spinnerContainer.style.display = 'none';
            this.messagesContainer.style.display = 'block';
        } else {
            this.spinnerContainer.style.display = 'block';
            this.messagesContainer.style.display = 'none';
        }
    }

    _createElement() {
        const template = `
              <div class="chati" id="main-container">
    <div class="chat-container" id="chat-cont">
        <div class="chat-header">
            <span class="chat-header-title">შეტყობინება</span>
            <div id="online-status" class="abs"></div>
            <button class="button button-icon" id="">
                <i class="material-symbols-outlined">minimize</i>
            </button>
        </div>
        <div class="chat-body" id="chat-body">
            <div class="form" id="form">
                <div class="button-container-flex">
                    <button id="registerBtn" class="button lightgray">რეგისტრაცია</button>
                    <button id="authBtn" class="button dodge">ავტორიზაცია</button>
                </div>
            </div>
            <div class="chat-flex" id="chat-flex">
                <div class="intersecting" id="intersecting"></div>
                <div id="messagesContainer"></div>
            </div>
            <div class="chat-loading">
            </div>
        </div>
    </div>
    <div class="chat-footer" id="chat-footer">
        <div class="search-md">
            <input type="text" id="messageInput" placeholder="">
            <i id="sendMessageBtn" class="material-icons send-message-icon">send</i>
        </div>
        <div class="snippet" id="snippet" style="display: none;">
            <div class="stage">
                <div class="dot-elastic"></div>
            </div>
        </div>
    </div>
    <div class="chat-spinner">
         <svg class="spinner" width="35px" height="35px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
             <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
         </svg>
    </div>
</div>
        `
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    };
}