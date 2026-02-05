import express from "express";
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
app.use(express.json());

// Public auth routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/slots", authMiddleware, slotRoutes);
app.use("/api/swaps", authMiddleware, swapRoutes);

// Health endpoint
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    success(res, { healthy: true });
  } catch (e) {
    res.status(500).json({ success: false, error: "DB connection failed" });
  }
});

app.use(errorHandler);

// Create HTTP server and WebSocket server sharing same port
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
  // Extract token from query param ?token=
  const parsed = url.parse(req.url || "", true);
  const token = parsed.query.token ? String(parsed.query.token) : null;
  const userId = connectionManager.authenticate(token);
  if (!userId) {
    // 4001 application-defined unauthorized
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

// Start server
server.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});