import { BehaviorSubject } from "../../utils/behaviorsubject.js";
import authService, { JWT_ACCESS_TOKEN } from "./auth.js";

class SocketService {
    constructor() {
        this.socketAuth = new BehaviorSubject(false);
        this.authService = authService;
    }
    
    initSocket() {
        /*
        const token = localStorage.getItem(JWT_ACCESS_TOKEN) ? localStorage.getItem(JWT_ACCESS_TOKEN) : '';
        
        this.socket = io('http://localhost:5000/', {
            query: {token}
        });
        

        this.socket.on("connect", () => {
            console.log(1);
            this.socketAuth.next(true);
        })

        this.socket.on("connect_error", (err) => {
            console.log(2);
            this.socketAuth.next(false);
        })

        this.socket.on("disconnect", (reason) => {
            console.log(3);
            this.socketAuth.next(false);
        })
       */
    }
    

    closeConnection() {
        if(this.socket) {
            this.socket.close();
        }
    }

    reconnectSocket() {
        this.socket.io.opts.query = {token: localStorage.getItem(JWT_ACCESS_TOKEN)};
        this.socket.disconnect();
        this.socket.connect();
    }

    handleAuthStateChange() {
        this.authService.authStateChange.subscribe(logged => {
          if(logged) {
            this.reconnectSocket();
          } else {
            this.closeConnection();
          }
        })
    }

    emit() {
        
    }
}

const socketService = new SocketService();
export default socketService;