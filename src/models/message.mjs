export class Message {
    constructor(content='', conversation='', userId='', sent = 0, last = 0) {
        this.content = content;
        this.conversation = conversation;
        this.userId = userId;
        this.sent = sent;
        this.last = last;
    }
}