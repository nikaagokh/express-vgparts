import { Header } from "./header.js";
import { Product } from "./product.js";
import { renderBottomConditionally, renderFixedPriceConditionally, renderPriceConditionally } from '../utils/render.js';
import { Bottom } from "./bottom.js";
import { FixedPrice } from './fixedprice.js';
import cookieService from "./services/cookies.js";

function init() {
    new Header();
    new Product();
    new Bottom();
    new FixedPrice();
    cookieService.setCookie('size', window.innerWidth);
    console.log(window.innerWidth)
    //renderBottomConditionally();
    //renderFixedPriceConditionally();
    //renderPriceConditionally();
    window.addEventListener('resize', () => {
        renderBottomConditionally();
        renderFixedPriceConditionally()
        renderPriceConditionally();
        cookieService.setCookie('size', window.innerWidth);
    })
}
window.addEventListener("DOMContentLoaded", init);