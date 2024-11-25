import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"], 
        credentials: true,
    }
});

export function getReceiverSocketId(userId) { //quando passiamo l'userId, fa un get del receiverId
    return userSocketMap[userId]
}

// Per tenere traccia delle connessioni degli utenti
const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("Un utente si è connesso", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // Emissione degli utenti online
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("Un utente si è disconnesso", socket.id);

        // Rimuovi l'utente dalla mappa quando si disconnette
        const userId = socket.handshake.query.userId;
        if (userId) {
            delete userSocketMap[userId];
        }

        // Emissione aggiornamento utenti online
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };
