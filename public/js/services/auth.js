import { BehaviorSubject } from "../../utils/behaviorsubject.js";
import overlayService from "./overlay.js";
export const JWT_ACCESS_TOKEN = 'access_token';
export const JWT_REFRESH_TOKEN = 'refresh_token';
class AuthService {
    constructor() {
        this.overlayService = overlayService;
        const token = localStorage.getItem(JWT_ACCESS_TOKEN);
        this.authStateChange = new BehaviorSubject(token ? true : false);
    }

    isAuthed() {
        const token = localStorage.getItem(JWT_ACCESS_TOKEN);
        return token && !this.tokenExpired(token);
    }
    isAdmin() {
        const token = this.getAccessToken();
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const userObj = JSON.parse(jsonPayload);
       
        return userObj.role === 'admin';
    }

    async adminGuard() {
        try {
            return fetch("http://localhost:3001/api/user/admin")
            .then(response => {
                if(!response.ok) {
                    throw new Error('er');
                }
                return true;
            })
        } catch(err) {
            return Promise.resolve(false)
        }
    }

    register(registerUser) {
        return fetch("http://localhost:3001/api/user/register", {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(registerUser)
        })
    }

    async login(email, password) {
        const login = {email, password};
        this.overlayService.openGlobalSpinner();
        return fetch("http://localhost:3001/api/user/login", {
            method:"POST",
            body:login
        }).then(response => {
            if(!response.ok) {
                throw new Error("error occured");
            }
            return response.json();

        }).then(token => {
            this.setAccessToken(token.accessToken);
            this.setRefreshToken(token.refreshToken);
            this.authStateChange.next(true);
            this.overlayService.closeGlobalSpinner();
            return Promise.resolve(null);
        })
        .catch(err => {
            console.log(err);
            return Promise.resolve(null);
        })
    }

    async logout() {
        this.authStateChange.next(false);
        localStorage.removeItem(JWT_ACCESS_TOKEN);
        localStorage.removeItem(JWT_REFRESH_TOKEN);
    }

    async isAuthenticated() {
        const accessToken = this.getAccessToken();
        if(!accessToken) {
          return Promise.resolve(false);
        }
        
        if(!this.isAuthed()) {
          return this.refreshToken()
          .then(resp => {
            return true;
          })
          .catch(err => {
            return false;
          })
        }
        return Promise.resolve(true);
    }

    async refreshToken() {
        refreshTokenInProgress = true;
        return fetch('/api/user/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: this.getRefreshToken() })
        })
        .then(response => response.json())
        .then(result => {
            this.setAccessToken(result.accesstoken);
            this.authStateChange.next(true)
            refreshTokenInProgress = false;
            return result.accesstoken;
        })
    }

    async verifyUser(pin) {
        return fetch(`/api/user/otp/verify`, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({pin})
        }).then(response => response.json())
        .then(res => {
            console.log(res);
            return res;
        })
    }

    getRefreshToken() {
        return localStorage.getItem(JWT_REFRESH_TOKEN);
    }

    setAccessToken(accessToken) {
        localStorage.setItem(JWT_ACCESS_TOKEN, accessToken);
    }

    setRefreshToken(refreshToken) {
        localStorage.setItem(JWT_REFRESH_TOKEN, refreshToken);
    }

    getAccessToken() {
        return localStorage.getItem(JWT_ACCESS_TOKEN);
    }

    tokenExpired(token) {
        const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
        return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    }

    getAuthState() {
        const token = localStorage.getItem(JWT_ACCESS_TOKEN);
        if(token) {
            return new CustomEvent("authstate", {detail:true})
        } else {
            return new CustomEvent("authstate", {detail:false})
        }
    }

    getAccessToken() {
        return ''
    }
}
const authService = new AuthService();
export default authService;