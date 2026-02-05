import prisma from "../database/prisma";

interface CreateSlotInput {
  userId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}

async function detectConflict(userId: string, date: string, startTime: string, endTime: string, excludeSlotId?: string): Promise<string | null> {
  const existingSlots = await prisma.slot.findMany({
    where: {
      userId,
      date,
      ...(excludeSlotId ? { id: { not: excludeSlotId } } : {}),
    },
  });

  for (const slot of existingSlots) {
    if (startTime < slot.endTime && slot.startTime < endTime) {
      return slot.id;
    }
  }

  return null;
}

export async function createSlotService(input: CreateSlotInput) {
  const conflictId = await detectConflict(input.userId, input.date, input.startTime, input.endTime);
  if (conflictId) {
    const err: any = new Error(`Time conflict with existing slot ${conflictId}`);
    err.statusCode = 409;
    throw err;
  }

  return prisma.slot.create({
    data: input,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function getSlotsService({ userId, date }: { userId: string; date?: string }) {
  const where: any = { userId };
  if (date) where.date = date;

  return prisma.slot.findMany({
    where,
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function getSlotByIdService(id: string) {
  return prisma.slot.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function updateSlotService(id: string, userId: string, updates: Partial<CreateSlotInput>) {
  const slot = await prisma.slot.findUnique({ where: { id } });
  if (!slot) {
    const err: any = new Error("Slot not found");
    err.statusCode = 404;
    throw err;
  }
  if (slot.userId !== userId) {
    const err: any = new Error("You can only edit your own slots");
    err.statusCode = 403;
    throw err;
  }
  if (slot.isLocked) {
    const err: any = new Error("Slot is locked by a pending swap request");
    err.statusCode = 403;
    throw err;
  }

  const date = updates.date || slot.date;
  const startTime = updates.startTime || slot.startTime;
  const endTime = updates.endTime || slot.endTime;

  const conflictId = await detectConflict(userId, date, startTime, endTime, id);
  if (conflictId) {
    const err: any = new Error(`Time conflict with existing slot ${conflictId}`);
    err.statusCode = 409;
    throw err;
  }

  return prisma.slot.update({
    where: { id },
    data: { ...updates, date, startTime, endTime },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function deleteSlotService(id: string, userId: string) {
  const slot = await prisma.slot.findUnique({ where: { id } });
  if (!slot) {
    const err: any = new Error("Slot not found");
    err.statusCode = 404;
    throw err;
  }
  if (slot.userId !== userId) {
    const err: any = new Error("You can only delete your own slots");
    err.statusCode = 403;
    throw err;
  }
  if (slot.isLocked) {
    const err: any = new Error("Slot is locked by a pending swap request");
    err.statusCode = 403;
    throw err;
  }

  return prisma.slot.delete({ where: { id } });
}