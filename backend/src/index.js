import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import os from "os";
import { app, server } from "./lib/socket.js";

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Função para obter todos os IPs locais
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (
        iface.family === "IPv4" &&
        !iface.internal &&
        iface.address &&
        iface.address !== "127.0.0.1"
      ) {
        ips.push(iface.address);
      }
    }
  }

  return ips;
}

const ips = getLocalIPs();
console.log("Local IPs found:", ips);

// Construir lista de origens permitidas
const allowedOrigins = [`https://localhost:5173`, ...ips.map(ip => `https://${ip}:5173`)];

// Log para verificar as origens
console.log("Allowed Origins CORS:", allowedOrigins);

// Middleware CORS
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("Not Allowed Origin from CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Frontend estático (produção)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
  });
}

// Iniciar servidor
server.listen(PORT, "0.0.0.0", () => {
  console.log(`\nHTTPS Server PORT: ${PORT}`);
  console.log(`🔗 Local:   https://localhost:${PORT}`);
  ips.forEach(ip => {
    console.log(`📡 LAN:     https://${ip}:${PORT}`);
  });
  console.log();
  connectDB();
});
