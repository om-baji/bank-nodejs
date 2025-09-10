import type { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code && err.code.startsWith("P")) {
    return res.status(400).json({
      success: false,
      message: "Database error",
      code: err.code,
    });
  }
  console.error("Unexpected error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
