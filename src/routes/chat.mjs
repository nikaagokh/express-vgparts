import { Router } from "express";
import eventEmitter from "../gateway/eventemitter.mjs";
import { authenticateJWT, checkRoles } from "../utils/index.mjs";
import { UserRole } from "../models/user.model.mjs";
import { sendMessage } from "../handlers/chat.mjs";
const router = Router();

router.post("/send", async (req, res, next) => {
    try {
        //const userId = req.user.id;
        //const userId = 1;
        //const messageDto = req.body;
        //const response = await sendMessage(userId, messageDto);
        //const {content, sent, last, time, seen, id} = response.message
        eventEmitter.emit('message.create', {name:'nika', gvari:'gokhadze', asaki:25});
        //res.json({message:{content, sent, last, time, seen, id}});
    } catch(err) {
        next(err);
    }
})

router.get("/messages/:id", authenticateJWT, async (req, res, next) => {
    try {
        const conversationId = req.user.id;
        const response = await getMessagesFromConv(conversationId);
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.get("/more/:id", authenticateJWT, async (req, res, next) => {
    try {
        const {conversationId, offset} = req.query;
        const userId = req.user.id;
        const response = await getMoreMessages(userId, conversationId, offset);
        eventEmitter.emit('message.more', {response, userId});
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.post("/init", authenticateJWT, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const response = await initConversation(userId);
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.get("/all", authenticateJWT, checkRoles([UserRole.ADMIN]), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const response = await getAllConversations(userId);
        res.json({response});
    } catch(err) {
        next(err);
    }
})

router.post("/seen/:id", authenticateJWT, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const response = await addSeenToConversation(id, userId)
        eventEmitter.emit('message.seen', {});
        res.json({});
    } catch(err) {
        next(err);
    }
})

router.get("/notseen", authenticateJWT, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const response = await checkUnseenMessages(userId);
    } catch(err) {
        next(err);
    }
})

export default router;