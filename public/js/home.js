import { Slider } from "./slider.js";

export class Home {
    constructor() {
        this.loaded = false;
        this.products = null;
        new Slider('discounted');
        new Slider('popular')
    }
}