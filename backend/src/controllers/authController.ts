import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";
import { success, error } from "../utils/response";

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    error(res, "email, password, and name are required");
    return;
  }

  try {
    const result = await registerUser({ email, password, name });
    success(res, result, 201);
  } catch (err: any) {
    if (err.code === "P2002") {
      error(res, "Email already registered", 409);
      return;
    }
    error(res, err.message, 500);
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    error(res, "email and password are required");
    return;
  }

  try {
    const result = await loginUser({ email, password });
    success(res, result);
  } catch (err: any) {
    error(res, err.message, 401);
  }
}