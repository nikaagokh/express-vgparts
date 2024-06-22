import { Router } from "express";
import axios from 'axios';
import i18next from "i18next";
import { extractToken, getUserWithJWT } from "../utils/index.mjs";
const router = Router();
//const store = i18next.store.data[lng].translations;
//const resource = i18next.getResource(lng, 'header');

router.get("/", (req, res) => {
    console.log('aeeeeeeeeeeeee');
    const lng = req.language;
    const header = req.t('header');
    const category = req.t('category');
    const slider = req.t('slider');
    const sliderd = req.t('sliderd');
    const bottom = req.t('bottom');
    const footer = req.t('footer');
    const mode = req.cookies.mode;
    const reqPath = req.url;
    const size = req.cookies.size;
    Promise.all([
        axios.get(`http://localhost:3001/${lng}/api/product/discounted?page=1&limit=12`),
        axios.get(`http://localhost:3001/${lng}/api/product/prius?page=1&limit=12`),
        axios.get(`http://localhost:3001/${lng}/api/category/roots`),
        axios.get(`http://localhost:3001/${lng}/api/product/popular?page=1&limit=12`),
    ]).then(([v1,v2,v3, v4]) => {
        const {rows:discounts} = v1.data.response;
        const {rows:priuses} = v2.data.response;
        const {rows:populars} = v4.data.response;
        const categories = v3.data.response;
        res.render("index", {categories, discounts, priuses, populars, title:'VGParts.shop',lng, header, category, slider, footer, mode, reqPath, bottom, size, sliderd});
    })
    
})

router.get("/subcategory", async (req, res) => {
    const id = req.query.id;
    const lng = req.language;
    const header = req.t('header');
    const bottom = req.t('bottom');
    const footer = req.t('footer');
    const mode = req.cookies.mode;
    const reqPath = req.url;
    const size = req.cookies.size;
    const {response:subcategories} = (await axios.get(`http://localhost:3001/api/category/subcategories/${id}`)).data;
    subcategories.forEach(sub => {
        console.log(sub.cyear);
        sub.cyear.forEach(cyear => {
            console.log(cyear);
        })
    })
    res.render("subcategory", {subcategories, lng, mode, header, footer, reqPath, bottom, size});
})

router.get("/category", async (req, res) => {
    const yearId = req.query.yearId;
    const categoryId = Number(req.query.categoryId);
    const page = Number(req.query.page);
    const lng = req.language;
    const header = req.t('header');
    const bottom = req.t('bottom');
    const errors = req.t('errors');
    const footer = req.t('footer');
    const size = req.cookies.size;
    const mode = req.cookies.mode;
    const reqPath = req.url;
    const {rows:products, totalPages:pages, totalCount:total} = (await axios.get(`http://localhost:3001/api/product/categoryYear?yearId=${yearId}&page=${page}`)).data.response;
    const hydration = JSON.stringify(products);
    const isFirstPage = (page === 1);
    const isLastPage = (page === pages.length);
    res.render("category-parts", {products, categoryId, page, pages, hydration, isFirstPage, isLastPage, yearId, categoryId, lng, mode, header, footer, errors, reqPath, bottom, size});
    
});

router.get("/product/:id", (req, res) => {
    const id = req.params.id;
    const lng = req.language;
    const header = req.t('header');
    const price = req.t('price');
    const info = req.t('info');
    const bottom = req.t('bottom');
    const fixed = req.t('fixedPrice');
    const simillars = req.t('simillars');
    const footer = req.t('footer');
    const mode = req.cookies.mode;
    const reqPath = req.url;
    const size = req.cookies.size;
    Promise.all([
        axios.get(`http://localhost:3001/api/product/${id}`),
        axios.get(`http://localhost:3001/api/product/simillars/${id}`),
    ]).then(([v1,v2]) => {
        const product = v1.data.response;
        const products = v2.data.response;
        const singleHydration = JSON.stringify(product);
        const similarsHydration = JSON.stringify(products);
        res.render("product", {product, products, single:singleHydration, similars:similarsHydration, lng, header, price, info, simillars, footer, mode, reqPath, fixed, bottom,size});
    })
    
})

router.get("/groupby", (req, res) => {
    const path = req.query.path;
    const group = req.query.group;
    const page = Number(req.query.page);
    const lng = req.language;
    const header = req.t('header');
    const errors = req.t('errors');
    const bottom = req.t('bottom');
    const slider = req.t('slider');
    const footer = req.t('footer');
    const mode = req.cookies.mode;
    const size = req.cookies.size;
    const reqPath = req.url;
    console.log(lng);
    axios.get(`http://localhost:3001/api/product/${path}?page=${page}&limit=24`)
    .then(v1 => {
     const {rows:products} = v1.data.response;
     const {totalPages:pages} = v1.data.response;
     const hydration = JSON.stringify(products);
     const isFirstPage = (page === 1);
     const isLastPage = (page === pages.length);
     res.render("groupby", {products, pages, hydration, isFirstPage, isLastPage, path, group, page, header, slider, footer, lng, mode, errors, reqPath, bottom, size})
    })
     
 })

 router.get("/filtered", (req, res) => {
    const yearIds = req.query.yearIds.split(',');
    console.log(yearIds);
    const page = Number(req.query.page);
    const lng = req.language;
    console.log(lng)
    const header = req.t('header');
    const errors = req.t('errors');
    const bottom = req.t('bottom');
    const footer = req.t('footer');
    const size = req.cookies.size || 992;
    const mode = req.cookies.mode;
    const reqPath = req.url;
    console.log(`http://localhost:3001/api/product/filtered?yearIds=${yearIds}&page=${page}`);
    axios.get(`http://localhost:3001/api/product/filtered?yearIds=${yearIds}&page=${page}`)
    .then(v1 => {
        console.log(v1);
        const {rows:products} = v1.data.response;
        const {totalPages:pages} = v1.data.response;
        const hydration = JSON.stringify(products);
        const isFirstPage = (page === 1);
        const isLastPage = (page === pages.length);
        const onePage = (pages.length === 1);
        res.render("filter", {products, pages, hydration, isFirstPage, isLastPage, page, onePage, yearIds:req.query.yearIds, lng, header, footer, mode, errors, reqPath, bottom, size});
    }).catch(err => {
        console.log('errr');
    })
 })

 router.get("/cart", (req, res) => {
    const lng = req.language;
    const header = req.t('header');
    const price = req.t('price');
    const fixedPrice = req.t('fixedPrice');
    const cartPrice = req.t('cartPrice');
    const bottom = req.t('bottom');
    const footer = req.t('footer');
    const token = req.cookies.token;
    const mode = req.cookies.mode;
    const size = req.cookies.size;
    axios.get(`http://localhost:3001/api/product/cart`, {
        headers: {
            'Authorization':`Bearer ${token}`
        }
    })
    .then(response => {
        const products = response.data.response;
        const {newPrice, oldPrice} = products.reduce((acc, item) => {
            acc.newPrice += Math.floor(item.price - (item.price * (item.discount/100))) * item.quantity;
            acc.oldPrice += item.price * item.quantity;
            return acc;
        }, {newPrice:0, oldPrice:0});
        const priceObj = {newPrice, oldPrice};
        res.render("cartSSR", {lng, header, footer, mode, size, price, bottom, products, priceObj});
    })
    .catch(err => {
        res.render("cartSPA", {lng, header, footer, mode, size, price, bottom, cartPrice});
    })
    
    //res.render("cart", {lng, header, footer, mode, size, price, bottom});
 })

 router.get('/buy', (req, res) => {
    const lng = req.language;
    const header = req.t('header');
    const footer = req.t('footer');
    const mode = req.cookies.mode;
    res.render("buy", {lng, header, footer, mode});
 })

 router.get('/example', (req, res) => {
    res.render("ex");
 })

export default router;