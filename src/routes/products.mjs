import { Router } from "express";
import { addProduct, getProductByCategoryYear, getProductsByCar, getProductsByCart, getProductsByDiscount, getProductsByFavorites, getProductsByFilter, getProductsByPopular, getProductsByPrius, getProductsBySearch, getSimillars, getSingleProduct } from "../handlers/products.mjs";
import { authenticateJWT, checkRoles, memoryUpload, upload } from "../utils/index.mjs";
import fs from 'fs';
import path from 'path';
import { UserRole } from "../models/user.model.mjs";
/*
const storage = multer.memoryStorage();
const upload = multer({storage})
*/
const router = Router();

router.get("/search", async (req, res, next) => {
    try {
        const word = req.query.word;
        const offset = req.query.offset;
        const response = await getProductsBySearch(word, offset);
        console.log(req.t('header'));
        res.json({response})
    } catch(err) {
        next(err);
    }
})

router.get("/categoryYear", async (req, res, next) => {
    try {
        const yearId = req.query.yearId;
        const page = req.query.page;
        const response = await getProductByCategoryYear(yearId, page);
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.get("/cart", authenticateJWT, async (req, res, next) => {
    try {
        const {id} = req.user;
        const response = await getProductsByCart(id);
        res.json({response});
    } catch(err) {
        next(err);
    }
    
})

router.get("/favorite", authenticateJWT, async (req, res, next) => {
    try {
        const {id} = req.body;
        const response = await getProductsByFavorites(id);
    } catch(err) {
        next(err);
    }
})

router.get("/simillars/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const response = await getSimillars(id);
        console.log(response)
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.get("/tag", async (req, res, next) => {
    try {
        const {id, page} = req.query;
        const response = await getProductsByTag(id, page);
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.post("/add", authenticateJWT, checkRoles([UserRole.ADMIN]), upload.single('file'), async (req, res, next) => {
    try {
        const file = req.file;
        //const object = req.body;
        const object = {nameGeo:'padkrilniki', nameEng:'adaw', price:8, type:0, discount:0, condition:'ახალი', description:'abcd', quantity:11};
        const response = await addProduct(file, object);
        console.log(response)
        //res.json({response})
    } catch(err) {
        next(err);
    }
})

router.post("/edit", authenticateJWT, checkRoles([UserRole.ADMIN]), upload.array('files'), async (req, res, next) => {
    try {
        const object = JSON.parse(req.body.data);
        const files = req.files;
        const prodId = object.existing[0].productId || object.id;
        const response = await editProduct(files, object, prodId);
    } catch(err) {
        next(err);
    }
})

router.get("/discounted", async(req, res, next) => {
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const response = await getProductsByDiscount(page, limit);
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.get("/popular", async (req, res, next) => {
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const response = await getProductsByPopular(page, limit);
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.get("/prius", async (req, res, next) => {
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const response = await getProductsByPrius(page, limit);
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.get("/cars", async (req, res, next) => {
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const response = await getProductsByCar(page, limit);
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.get("/filtered", async (req, res, next) => {
    try {
        const yearIds = req.query.yearIds.split(',').map(numString => parseInt(numString));
        const page = Number(req.query.page);
        const response = await getProductsByFilter(yearIds, page);
        res.json({response});
    } catch(err) {
        next(err);
    }
    
})

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const response = await getSingleProduct(id);
    console.log(response);
    res.json({response});
})






export default router;
