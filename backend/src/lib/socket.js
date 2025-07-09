import { Server } from "socket.io";
import fs from "fs";
import https from "https";
import express from "express";
import path from "path";
import os from "os";

const __dirname = path.resolve();
const app = express();

// Ler certificados .pem
const privateKey = fs.readFileSync(path.join(__dirname, "key.pem"), "utf8");
const certificate = fs.readFileSync(path.join(__dirname, "cert.pem"), "utf8");
const credentials = { key: privateKey, cert: certificate };

// Criar servidor HTTPS
const httpsServer = https.createServer(credentials, app);

// Função para obter o IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  let candidate = null;
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal && iface.address !== "127.0.0.1") {
        if (
          name.toLowerCase().includes("wi-fi") ||
          name.toLowerCase().includes("wlan") ||
          name.toLowerCase().includes("eth")
        ) {
          return iface.address;
        }
        if (!candidate) candidate = iface.address;
      }
    }
  }
  return candidate || "localhost";
}

const localIP = getLocalIP();

// Criar Socket.io com CORS configurado
const io = new Server(httpsServer, {
  cors: {
    origin: [`https://localhost:5173`, `https://${localIP}:5173`],
    credentials: true,
  },
});

// Mapa para armazenar utilizadores
const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Lógica do Socket.io
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId === "null") {
    console.log("User disconnected: ", socket.id);
    return;
  }

  console.log("User connected: ", socket.id, "UserID:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("sendMessage", ({ to, message }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }
  });

  socket.on("call:offer", ({ to, offer, from }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:incoming-offer", { from, offer });
      socket.emit("call:calling", { to });
    }
  });

  socket.on("call:ready", ({ from, to }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:ready", { from });
    }
  });

  socket.on("call:answer", ({ to, answer }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:answer", answer);
    }
  });

  socket.on("call:ice-candidate", ({ to, candidate }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:ice-candidate", candidate);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, httpsServer as server, app };
