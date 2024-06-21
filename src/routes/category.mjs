import { Router } from "express";
import { getAllCategories, getAllCategoriesWithChildren, getBreadcrumbCategory, getChildrenCategories, getOneCategory, getSubcategories } from "../handlers/category.mjs";

const router = Router();

router.get("/full", async (req, res, next) => {
    try {
        const response = await getAllCategoriesWithChildren();
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.get("/roots", async (req, res, next) => {
    try {
        const response = await getAllCategories();
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.get("/breadcrumb/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const response = await getBreadcrumbCategory(id);
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.get("/children/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const response = await getChildrenCategories(id);
        console.log(response);
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.get("/subcategories/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        console.log(id);
        const response = await getSubcategories(id);
        res.json({response});
    } catch(err) {
        next(err);
    }
})


router.get("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const response = await getOneCategory(id);
        res.json({response});
    } catch(err) {
        next(err);
    }
})

export default router;