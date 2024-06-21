import { Header } from "./header.js";

import { Bottom } from "./bottom.js";
import { renderBottomConditionally } from "../utils/render.js";
function init() {
    new Header();
    new Bottom();
    renderBottomConditionally();
    
    window.addEventListener('resize', () => {
        renderBottomConditionally();
    })
}
window.addEventListener("DOMContentLoaded", init);