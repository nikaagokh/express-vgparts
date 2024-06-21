import { Header } from "./header.js";
import { Home } from "./home.js";
import { Bottom } from "./bottom.js";

import { FixedPrice } from "./fixedprice.js";
import { renderBottomConditionally } from "../utils/render.js";
import cookieService from "./services/cookies.js";


async function init() {
    new Header();
    new Home();
    new Bottom();
    cookieService.setCookie('size', window.innerWidth);
    renderBottomConditionally();
    window.addEventListener('resize', () => {
        renderBottomConditionally();
        cookieService.setCookie('size', window.innerWidth);
    })
    /*
    const iframe = document.querySelector("#myframe");
    document.querySelector("#framebutton").addEventListener("click", () => {
        //const popup = window.open('http://127.0.0.1:5500/index.html');
        //iframe.contentWindow.postMessage('hi', window.location.origin);
        const iframe = document.getElementById("myframe");
        const random = Math.random();
        iframe.contentWindow.postMessage(random, "*");
        console.log(iframe.contentWindow)
    })

   window.addEventListener("message", function (event) {
     console.log(event);
    })
*/
}
window.addEventListener("load", init);