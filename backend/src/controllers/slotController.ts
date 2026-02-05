import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { createSlotService, getSlotsService, getSlotByIdService, updateSlotService, deleteSlotService } from "../services/slotService";
import { success, error } from "../utils/response";

export async function createSlot(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { title, date, startTime, endTime } = req.body;
  if (!title || !date || !startTime || !endTime) {
    error(res, "title, date, startTime, and endTime are required");
    return;
  }

  try {
    const slot = await createSlotService({ userId: req.userId!, title, date, startTime, endTime });
    success(res, slot, 201);
  } catch (err: any) {
    error(res, err.message, err.statusCode || 400);
  }
}

export async function getSlots(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { userId, date } = req.query;
  const slots = await getSlotsService({
    userId: (userId as string) || req.userId!,
    date: date as string | undefined,
  });
  success(res, slots);
}

export async function getSlotById(req: AuthenticatedRequest, res: Response): Promise<void> {
  const slot = await getSlotByIdService(req.params.id);
  if (!slot) {
    error(res, "Slot not found", 404);
    return;
  }
  success(res, slot);
}

export async function updateSlot(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const slot = await updateSlotService(req.params.id, req.userId!, req.body);
    success(res, slot);
  } catch (err: any) {
    error(res, err.message, err.statusCode || 400);
  }
}

export async function deleteSlot(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    await deleteSlotService(req.params.id, req.userId!);
    success(res, { message: "Slot deleted" });
  } catch (err: any) {
    error(res, err.message, err.statusCode || 400);
  }
}