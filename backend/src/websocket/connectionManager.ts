import WebSocket from "ws";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

type SocketSet = Set<WebSocket>;

class ConnectionManager {
  private map: Map<string, SocketSet> = new Map();

  authenticate(token?: string | null): string | null {
    if (!token) return null;
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as any;
      return payload.userId;
    } catch {
      return null;
    }
  }

  register(userId: string, ws: WebSocket) {
    let set = this.map.get(userId);
    if (!set) {
      set = new Set();
      this.map.set(userId, set);
    }
    set.add(ws);
  }

  deregister(userId: string, ws: WebSocket) {
    const set = this.map.get(userId);
    if (!set) return;
    set.delete(ws);
    if (set.size === 0) this.map.delete(userId);
  }

  getSockets(userId: string): SocketSet {
    return this.map.get(userId) ?? new Set();
  }
}

export default new ConnectionManager();