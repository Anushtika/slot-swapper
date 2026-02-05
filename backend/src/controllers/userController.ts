import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import prisma from "../database/prisma";
import { success, error } from "../utils/response";

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  if (!user) {
    error(res, "User not found", 404);
    return;
  }

  success(res, user);
}

export async function getUserCalendar(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { date } = req.query;

  const where: any = { userId: id };
  if (date) {
    where.date = date as string;
  }

  const slots = await prisma.slot.findMany({
    where,
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  success(res, slots);
}