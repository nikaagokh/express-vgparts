import { Header } from "./header.js";
import { Cart } from "./cart.js";

import { Bottom } from "./bottom.js";
import { renderBottomConditionally } from "../utils/render.js";

function init() {
    new Header();
    new Cart();
    new Bottom();
    renderBottomConditionally();
    
    window.addEventListener('resize', () => {
        renderBottomConditionally();
    })
}
window.addEventListener("DOMContentLoaded", init);