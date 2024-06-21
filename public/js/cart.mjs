import { Header } from "./header.js";
import { Cart } from "./cart.js";

import { Bottom } from "./bottom.js";
import { renderBottomConditionally, renderCartPriceConditionally, renderPriceConditionally } from "../utils/render.js";

function init() {
    new Header();
    new Cart();
    new Bottom();
    window.addEventListener('resize', () => {
        renderBottomConditionally();
        renderPriceConditionally();
        renderCartPriceConditionally();
    })
}
window.addEventListener("DOMContentLoaded", init);