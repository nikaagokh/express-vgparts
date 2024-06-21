import path from 'path';
import { Router } from "express";

const router = Router();

router.get("/product/:imagename", async (req, res) => {
    const {imagename} = req.params;
    res.sendFile(path.join(process.cwd(), 'uploads/product', imagename));
})

router.get("/category/:imagename", async (req, res) => {
    const {imagename} = req.params;
    res.sendFile(path.join(process.cwd(), 'uploads/category', imagename));
})

router.get("/subcategory/:imagename", async (req, res) => {
    const {imagename} = req.params;
    res.sendFile(path.join(process.cwd(), 'uploads/subcategory', imagename));
})

export default router;