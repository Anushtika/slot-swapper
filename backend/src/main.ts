import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import url from "url";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import slotRoutes from "./routes/slotRoutes";
import swapRoutes from "./routes/swapRoutes";
import { authMiddleware } from "./middleware/auth";
import errorHandler from "./middleware/errorHandler";
import connectionManager from "./websocket/connectionManager";
import { env } from "./config/env";
import { success } from "./utils/response";
import prisma from "./database/prisma";

const app = express();

app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/slots", authMiddleware, slotRoutes);
app.use("/api/swaps", authMiddleware, swapRoutes);

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    success(res, { healthy: true });
  } catch (e) {
    res.status(500).json({ success: false, error: "DB connection failed" });
  }
});

app.use(errorHandler);

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true, path: "/ws" });

server.on("upgrade", (req, socket, head) => {
  const parsed = url.parse(req.url || "", true);
  if (parsed.pathname !== "/ws") {
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket as any, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws, req) => {
  const parsed = url.parse(req.url || "", true);
  const token = parsed.query.token ? String(parsed.query.token) : null;
  const userId = connectionManager.authenticate(token);
  if (!userId) {
    try {
      ws.close(4001, "Unauthorized");
    } catch {}
    return;
  }
  connectionManager.register(userId, ws);

  ws.on("close", () => {
    connectionManager.deregister(userId, ws);
  });
  ws.on("error", () => {
    connectionManager.deregister(userId, ws);
  });
});

server.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});