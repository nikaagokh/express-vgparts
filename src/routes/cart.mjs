import { Router } from "express";
import { authenticateJWT } from "../utils/index.mjs";
import { addOne, removeOne } from "../handlers/cart.mjs";

const router = Router();

router.post("/add", authenticateJWT, async (req, res, next) => {
    try {
        const userId = req.user
        const {productId} = req.body;
        const response = await addOne(productId, userId);
        res.json({response})
    } catch(err) {
        next(err);
    }
})

router.post("/remove", authenticateJWT, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const {productId, clear} = req.body;
        const response = await removeOne(productId, userId, clear);
    } catch(err) {
        next(err);
    }
})

export default router;
