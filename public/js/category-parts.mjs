import { CategoryParts } from "./category-parts.js";
import { Header } from "./header.js";
import { renderBottomConditionally } from '../utils/render.js'
import { Bottom } from "./bottom.js";
function init() {
    new Header();
    new CategoryParts();
    new Bottom();
    renderBottomConditionally();
    window.addEventListener('resize', () => {
        renderBottomConditionally();
    })
}
window.addEventListener("DOMContentLoaded", init);