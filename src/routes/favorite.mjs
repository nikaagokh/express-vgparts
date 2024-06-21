import { Router } from "express";
import { authenticateJWT } from "../utils/index.mjs";

const router = Router();

router.post('manage', authenticateJWT, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const prodId = req.body.id;
        const response = await manageFavorites(prodId, userId)
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.delete('/delete/:id', authenticateJWT, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const response = await deleteFavoritesOfUser(userId);
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.get("/product/:id", authenticateJWT, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const response = await checkIfFavorite(userId);
        res.json({response});
    } catch(err) {
        next(err);
    }
})

export default router;