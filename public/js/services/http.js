import toastService from "./toast.js";
import authService from "./auth.js";
import cookieService from "./cookies.js";
import { BehaviorSubject } from "../../utils/behaviorsubject.js";
class HttpService {
    constructor() {
        this.cookieService = cookieService;
        this.toastService = toastService;
        this.cartObject = {products:[], total:0, discount:0};
        this.authService = authService;
        this.authService.isAuthenticated().then(x => this.authed = x);
        if(localStorage.getItem('cart')) {
            const cartObject = JSON.parse(localStorage.getItem('cart'));
            const {total, discount} = cartObject.products.reduce((acc, item) => {
                acc.total += item.price * item.quantity;
                acc.discount += ((item.price * item.discount) / 100) * item.quantity;
                return acc;
            }, {total:0, discount:0});
            this.cartObject = { products:cartObject.products, total:total, discount:discount };
            this.cartProducts$ = new BehaviorSubject(this.cartObject);
        } else {
            this.cartProducts$ = new BehaviorSubject(this.cartObject);
        }
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

    async searchByWord(word, offset = 1) {
        return fetch(`http://localhost:3001/api/product/search?word=${word}&offset=${offset}`)
        .then(res => {
            return res.json();
        })
    }

    async getProductsByCategoryYear(yearId, page = 1) {
        return fetch(`http://localhost:3001/api/product/categoryYear/${yearId}/${page}`)
        .then(resp => resp.json())
        .catch(e => [])
    }

    async getSubCategories(id) {
        return fetch(`http://localhost:3001/api/categories/subcategories/${id}`)
        .then(resp => resp.json())
        .catch(err => [])
    }

    async getSingleProduct(id) {
        return fetch(`http://localhost:3001/api/product/${id}`)
        .then(resp => resp.json())
        .catch(err => {
            console.log(err)
        })
    }

    async getSimillars(id) {
        return fetch(`http://localhost:3001/api/product/similars/${id}`)
        .then(resp => resp.json())
        .catch(err => {
            console.log(err);
        })
    }

    getCartProducts() {
        console.log(123);
        if(!this.authed) {
            this.cartObject = JSON.parse(localStorage.getItem('cart')) || {products:[], total:0, discount:0};
            this.cartProducts$.next(this.cartObject);
            //this.cartProducts$.dispatchEvent(new CustomEvent("cart", {detail:this.cartObject}));
        } else {
            
            return fetch("http://localhost:3001/api/product/cart")
            .then(resp => resp.json())
            .then(cart => {
                this.cartObject = cart;
                this.cartProducts$.next(this.cartObject);
                //this.cartProducts$.dispatchEvent(new CustomEvent("cart", {detail:this.cartObject}));
            })
            .catch(err => this.handleError(err))
        }
    }


    addToCart(product) {
            if(this.authed) {
                return this.handleAddToServer(product);
            } else {
                console.log('notauthed')
                return this.handleAddToLocalStorage(product);
            }
        
    }

    handleAddToLocalStorage(product) {
        const exists = this.cartObject.products?.find(prod => prod.id === product.id);
        if(exists) {
            this.cartObject.products.map((prod) => {
                if(prod.id === product.id) {
                    prod.quantity++;
                }
            })
            localStorage.setItem("cart", JSON.stringify(this.cartObject));
            this.cartProducts$.next(this.cartObject);
            //this.cartProducts$.dispatchEvent(new CustomEvent("cart", {detail:this.cartObject}));
        } else {
            const qty = 1;
            product.quantity = qty;
            this.cartObject.products.push(product);
            localStorage.setItem('cart', JSON.stringify(this.cartObject));
            this.cartProducts$.next(this.cartObject);
            //this.cartProducts$.dispatchEvent(new CustomEvent("cart", {detail:this.cartObject}));
        }

        //producti warmatebit daemata
        this.toastService.showToast("პროდუქტი წარმატებით დაემატა კალათაში");
        return Promise.resolve(null);
    }

    handleAddToServer() {
        this.toastService.showToast("პროდუქტი წარმატებით დაემატა კალათაში");
        return Promise.resolve(null);
    }


    handleError(er) {
        console.log(er)
    }

    removeFromCart(product, full = true) {
        if(this.authed) {
            return this.handleRemoveFromServer(product, full);
        } else {
            return this.handleRemoveFromLocal(product, full);
        }
    }

    handleRemoveFromLocal(product, full) {
        if(full) {
            this.cartObject.products.map((prod, index) => {
                if(prod.id === product.id) {
                    this.cartObject.products.splice(index,1);
                }
            })
            localStorage.setItem("cart", JSON.stringify(this.cartObject));
            this.cartProducts$.next(this.cartObject);
        } else {
            this.cartObject.products.map((prod, index) => {
                if(product.id === prod.id) {
                  if(this.cartObject.products[index].quantity > 1) {
                    this.cartObject.products[index].quantity--;
                  } else {
                    this.cartObject.products.splice(index,1);
                  }
                }
              })
              localStorage.setItem('cart', JSON.stringify(this.cartObject));
              this.cartProducts$.next(this.cartObject);
        }
    }

    async getGroupProducts(path, page, cur = 0) {
        return fetch(`http://localhost:3001/api/product/${path}/${page}/${cur}`)
        .then(resp => resp.json())
        .catch(err => console.log(err));
    }
}
const httpService = new HttpService();
export default httpService;