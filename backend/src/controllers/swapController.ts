import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { createSwapService, getSwapsService, getSwapByIdService, acceptSwapService, rejectSwapService, cancelSwapService } from "../services/swapService";
import { success, error } from "../utils/response";

export async function createSwap(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { sourceSlotId, targetSlotId, receiverId } = req.body;
  if (!sourceSlotId || !targetSlotId || !receiverId) {
    error(res, "sourceSlotId, targetSlotId, and receiverId are required");
    return;
  }

  try {
    const swap = await createSwapService({ senderId: req.userId!, sourceSlotId, targetSlotId, receiverId });
    success(res, swap, 201);
  } catch (err: any) {
    error(res, err.message, err.statusCode || 400);
  }
}

export async function getSwaps(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { status } = req.query;
  const swaps = await getSwapsService(req.userId!, status as string | undefined);
  success(res, swaps);
}

export async function getSwapById(req: AuthenticatedRequest, res: Response): Promise<void> {
  const swap = await getSwapByIdService(req.params.id);
  if (!swap) {
    error(res, "Swap not found", 404);
    return;
  }
  success(res, swap);
}

export async function acceptSwap(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const swap = await acceptSwapService(req.params.id, req.userId!);
    success(res, swap);
  } catch (err: any) {
    error(res, err.message, err.statusCode || 400);
  }
}

export async function rejectSwap(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const swap = await rejectSwapService(req.params.id, req.userId!);
    success(res, swap);
  } catch (err: any) {
    error(res, err.message, err.statusCode || 400);
  }
}

export async function cancelSwap(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const swap = await cancelSwapService(req.params.id, req.userId!);
    success(res, swap);
  } catch (err: any) {
    error(res, err.message, err.statusCode || 400);
  }
}