import connectionManager from "./connectionManager";

export interface SwapEvent {
  type: "SWAP_CREATED" | "SWAP_ACCEPTED" | "SWAP_REJECTED" | "SWAP_CANCELLED";
  swapId: string;
  senderId: string;
  receiverId: string;
  sourceSlotId: string;
  targetSlotId: string;
  status: string;
  timestamp: string;
}

function sendToUser(userId: string, event: SwapEvent): void {
  const payload = JSON.stringify(event);
  for (const ws of connectionManager.getSockets(userId)) {
    if (ws.readyState === 1) {
      ws.send(payload);
    }
  }
}

export function broadcastSwapEvent(event: SwapEvent): void {
  sendToUser(event.senderId, event);
  sendToUser(event.receiverId, event);
}