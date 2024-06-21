import { Socket } from "socket.io";
import eventEmitter from "./eventemitter.mjs";
import jwt from "jsonwebtoken";
import {getSockets, getUserSocket, removeUserSocket, setUserSocket} from './session.mjs';
export const configureIO = (io) => {
    /*
    io.use(authenticateIO)
    io.on("connection", (socket) => {
        setUserSocket(socket.user.user.id, socket);
        if(socket.user.user.role === 'admin') {
            getSockets().forEach((sock) => {
              sock.emit('online', {online:true});
            })
        }
        socket.on('typing', (socket, data) => {
            const {personId, typing} = data;
            const userSocket = getUserSocket(personId);
            if(userSocket) {
                userSocket.emit("typing", typing);
            }
        })
        socket.on("disconnect", (socket) => {
            removeUserSocket(socket.user.user.id); 
            if(socket.user.user.role === 'admin') {
               this.sessions.getSockets().forEach((sock) => {
               sock.emit('online', {online:false});
               })
            }
        })  
    })

    eventEmitter.on('message.create', (payload) => {
        const {message, conversation} = payload;
        const {content, sent, last, time, seen, conversationId} = message;
        const {lastMessage, id, lastMessageSent, person, personId} = conversation;

    })
        
}

const authenticateIO = (socket, next) => {
    const authorization = socket.handshake.query['token'];
    if (!authorization) {
        return next(new Error('გაიარეთ ავტორიზაცია ან რეგისტრაცია'));
    }
    const token = Array.isArray(authorization) ? authorization[0] : authorization;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log(14);
            console.log('err');
            return next(new Error('გაიარეთ ავტორიზაცია ან რეგისტრაცია'));
        }
        console.log(5)
        socket.user = decoded;
        next();
    });
    */
};