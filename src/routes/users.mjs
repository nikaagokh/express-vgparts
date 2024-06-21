import { Router } from "express";
import {changePassword, loginUser, refreshToken, registerUser, updatePassword, verifyMail, verifyOtp, verifyRenewOtp} from '../handlers/users.mjs';
import { checkRoles, upsertRow } from "../utils/index.mjs";
import { User, UserRole } from "../models/user.model.mjs";

const router = Router();

router.post("/register", async (req, res, next) => {
    try {
        const user = req.body;
        const response = await registerUser(user);
        res.json(response);
    } catch (err) {
        console.log(12333333333);
        next(err);
    }
})

router.post("/login", async (req, res, next) => {
    try {
        const user = req.body;
        const response = await loginUser(user);
        res.json(response);
    } catch (err) {
        next(err);
    }
})

router.post("/google", async (req, res, next) => {
    try {
        const user = req.body;
        //const response = await 
    } catch (err) {
        next(err);
    }
})

router.post("/refresh", async (req, res, next) => {
    try {
        const user = req.body;
        const response = await refreshToken(user);
        res.json(response);
    } catch(err) {
        next(err);
    }
})

router.post("/password/update", async (req, res, next) => {
    try {
        const {newPassword, oldPassword} = req.body;
        const response = await updatePassword(oldPassword, newPassword);
        res.json(response);
    } catch(err) {
        next(err);
    }
})

router.post("/password/renew", async (req, res, next) => {
    try {
        const {password, pin} = req.body;
        const response = await changePassword(pin, password);
        res.json(response);
    } catch(err) {
        next(err);
    }
})

router.post("/otp/verify", async (req, res, next) => {
    try {
        console.log('top')
        const pin = Number(req.body.pin);
        
        const response = await verifyOtp(pin);
        res.json(response);
    } catch(err) {
        next(err);
    }
})

router.post("/mail/verify", async (req, res, next) => {
    try {
        const {email}= req.body;
        const response = await verifyMail(email);
        res.json(response);
    } catch(err) {
        next(err);
    }
})

router.post("/renew, verify", async(req, res, next) => {
    try {
        const {pin} = req.body;
        const response = await verifyRenewOtp(pin);
        res.json(response);
    } catch(err) {
        next(err);
    }
})

router.get("/logintest", async (req, res) => {
    await loginTest();
})

router.get("/isAdmin", checkRoles([UserRole.ADMIN]), async (req, res) => {
    res.json({admin:true});
})
router.post("/samagalito", async (req, res) => {
    const user = new User();
    user.firstName = 'nika';
    user.lastName = 'gokhadze';
    user.email = 'ngokhadze99@gmail.com'
    user.password = 'gokhuna11';
    user.role = UserRole.ADMIN;
    upsertRow('user', user, {id:4});
})

export default router;