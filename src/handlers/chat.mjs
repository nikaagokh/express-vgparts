import { pool } from "../database/connect.mjs"
import { Message } from "../models/message.mjs";
import { deleteRow, insertRow, limit, throwError, updateRow } from "../utils/index.mjs";

export const sendMessage = async (fromId, messageDto) => {
    const {content, conversationId} = messageDto;
    const [admin] = (await pool.query(`select * from user where role = 'admin' limit 1`))[0];
    const [conversation] = (await pool.query(`select * from user_chat where id = ${conversationId} and (fromId = ${userId} or toId = ${userId}) limit 1`))[0];
    if(!conversation) throwError('ჩათი ვერ მოიძებნა', 400);
    const message = await configureMessage(content, conversation, fromId);
}

const configureMessage = async (content, conversation, fromId) => {
    const message = new Message(content, conversation, fromId);
    await insertRow('message', tempMessage);
    if(message.userId === fromId) {
        message.sent = true;
    } else {
        message.sent = false;
    }
    message.last = false;
    return message;
}
