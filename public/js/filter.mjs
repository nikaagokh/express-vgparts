import { Header } from "./header.js";
import {Filter} from './filter.js';
import { renderBottomConditionally } from "../utils/render.js";
import { Bottom } from "./bottom.js";
function init() {
    new Header();
    new Filter();
    new Bottom();
    renderBottomConditionally();
    
    window.addEventListener('resize', () => {
        renderBottomConditionally();
    })
}
window.addEventListener("load", init);