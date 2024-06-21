import { Router } from "express";

const router = Router();

router.get('/translate', (req, res) => {
    const section = req.query.section;
    const translation = req.t(section);
    res.json(translation);
})

export default router;