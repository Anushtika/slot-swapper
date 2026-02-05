import { Response } from 'express';

export function success(res: Response, data: any, status = 200): void {
  res.status(status).json({ success: true, data });
}

export function error(res: Response, message: string, status = 400): void {
  res.status(status).json({ success: false, error: message });
}