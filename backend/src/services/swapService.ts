import prisma from "../database/prisma";
import { broadcastSwapEvent, SwapEvent } from "../websocket/broadcaster";

interface CreateSwapInput {
  senderId: string;
  sourceSlotId: string;
  targetSlotId: string;
  receiverId: string;
}

function buildEvent(swap: any, type: SwapEvent["type"]): SwapEvent {
  return {
    type,
    swapId: swap.id,
    senderId: swap.senderId,
    receiverId: swap.receiverId,
    sourceSlotId: swap.sourceSlotId,
    targetSlotId: swap.targetSlotId,
    status: swap.status,
    timestamp: new Date().toISOString(),
  };
}

export async function createSwapService(input: CreateSwapInput) {
  const { senderId, sourceSlotId, targetSlotId, receiverId } = input;

  const sourceSlot = await prisma.slot.findUnique({ where: { id: sourceSlotId } });
  if (!sourceSlot) {
    const err: any = new Error("Source slot not found");
    err.statusCode = 404;
    throw err;
  }
  if (sourceSlot.userId !== senderId) {
    const err: any = new Error("Source slot does not belong to you");
    err.statusCode = 403;
    throw err;
  }
  if (sourceSlot.isLocked) {
    const err: any = new Error("Source slot is already locked by another swap");
    err.statusCode = 409;
    throw err;
  }

  const targetSlot = await prisma.slot.findUnique({ where: { id: targetSlotId } });
  if (!targetSlot) {
    const err: any = new Error("Target slot not found");
    err.statusCode = 404;
    throw err;
  }
  if (targetSlot.userId !== receiverId) {
    const err: any = new Error("Target slot does not belong to the specified receiver");
    err.statusCode = 403;
    throw err;
  }
  if (targetSlot.isLocked) {
    const err: any = new Error("Target slot is already locked by another swap");
    err.statusCode = 409;
    throw err;
  }

  const swap = await prisma.$transaction(async (tx) => {
    await tx.slot.update({ where: { id: sourceSlotId }, data: { isLocked: true } });
    await tx.slot.update({ where: { id: targetSlotId }, data: { isLocked: true } });

    return tx.swapRequest.create({
      data: { senderId, receiverId, sourceSlotId, targetSlotId, status: "PENDING" },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
        sourceSlot: true,
        targetSlot: true,
      },
    });
  });

  broadcastSwapEvent(buildEvent(swap, "SWAP_CREATED"));
  return swap;
}

export async function acceptSwapService(swapId: string, receiverId: string) {
  const swap = await prisma.swapRequest.findUnique({ where: { id: swapId } });
  if (!swap) {
    const err: any = new Error("Swap request not found");
    err.statusCode = 404;
    throw err;
  }
  if (swap.receiverId !== receiverId) {
    const err: any = new Error("Only the receiver can accept this swap");
    err.statusCode = 403;
    throw err;
  }
  if (swap.status !== "PENDING") {
    const err: any = new Error("Swap is no longer pending");
    err.statusCode = 409;
    throw err;
  }

  const updated = await prisma.$transaction(async (tx) => {
    const sourceSlot = await tx.slot.findUnique({ where: { id: swap.sourceSlotId } });
    const targetSlot = await tx.slot.findUnique({ where: { id: swap.targetSlotId } });

    if (!sourceSlot || !targetSlot) throw new Error("Slot was deleted during swap");
    if (!sourceSlot.isLocked || !targetSlot.isLocked) throw new Error("Slot lock was released unexpectedly");

    await tx.slot.update({
      where: { id: swap.sourceSlotId },
      data: { userId: targetSlot.userId, isLocked: false },
    });
    await tx.slot.update({
      where: { id: swap.targetSlotId },
      data: { userId: sourceSlot.userId, isLocked: false },
    });

    return tx.swapRequest.update({
      where: { id: swapId },
      data: { status: "ACCEPTED" },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
        sourceSlot: true,
        targetSlot: true,
      },
    });
  });

  broadcastSwapEvent(buildEvent(updated, "SWAP_ACCEPTED"));
  return updated;
}

export async function rejectSwapService(swapId: string, receiverId: string) {
  const swap = await prisma.swapRequest.findUnique({ where: { id: swapId } });
  if (!swap) {
    const err: any = new Error("Swap request not found");
    err.statusCode = 404;
    throw err;
  }
  if (swap.receiverId !== receiverId) {
    const err: any = new Error("Only the receiver can reject this swap");
    err.statusCode = 403;
    throw err;
  }
  if (swap.status !== "PENDING") {
    const err: any = new Error("Swap is no longer pending");
    err.statusCode = 409;
    throw err;
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.slot.update({ where: { id: swap.sourceSlotId }, data: { isLocked: false } });
    await tx.slot.update({ where: { id: swap.targetSlotId }, data: { isLocked: false } });

    return tx.swapRequest.update({
      where: { id: swapId },
      data: { status: "REJECTED" },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
        sourceSlot: true,
        targetSlot: true,
      },
    });
  });

  broadcastSwapEvent(buildEvent(updated, "SWAP_REJECTED"));
  return updated;
}

export async function cancelSwapService(swapId: string, senderId: string) {
  const swap = await prisma.swapRequest.findUnique({ where: { id: swapId } });
  if (!swap) {
    const err: any = new Error("Swap request not found");
    err.statusCode = 404;
    throw err;
  }
  if (swap.senderId !== senderId) {
    const err: any = new Error("Only the sender can cancel this swap");
    err.statusCode = 403;
    throw err;
  }
  if (swap.status !== "PENDING") {
    const err: any = new Error("Swap is no longer pending");
    err.statusCode = 409;
    throw err;
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.slot.update({ where: { id: swap.sourceSlotId }, data: { isLocked: false } });
    await tx.slot.update({ where: { id: swap.targetSlotId }, data: { isLocked: false } });

    return tx.swapRequest.update({
      where: { id: swapId },
      data: { status: "CANCELLED" },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
        sourceSlot: true,
        targetSlot: true,
      },
    });
  });

  broadcastSwapEvent(buildEvent(updated, "SWAP_CANCELLED"));
  return updated;
}

export async function getSwapsService(userId: string, status?: string) {
  const where: any = {
    OR: [{ senderId: userId }, { receiverId: userId }],
  };
  if (status) where.status = status;

  return prisma.swapRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
      sourceSlot: true,
      targetSlot: true,
    },
  });
}

export async function getSwapByIdService(id: string) {
  return prisma.swapRequest.findUnique({
    where: { id },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
      sourceSlot: true,
      targetSlot: true,
    },
  });
}