import { Router } from "express";

const router = Router();

router.post('/toggle-theme', (req, res) => {
    const currentMode = req.cookies.mode || 'light';
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    console.log(newMode);
    res.cookie('mode', newMode, {httpOnly:false});
})

export default router;