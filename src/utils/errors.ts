import { Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const enum ErrorMessages {
  INVALID_PLACE_ID = "Invalid Place ID",
  PLACE_NOT_FOUND = "Place not found",
  MISSING_OR_INVALID_FIELDS = "Missing or invalid required fields",
  INVALID_COORDINATES = "Invalid coordinates",
  MISSING_TOKEN = "Missing token",
  INVALID_CREDENTIALS = "Invalid credentials",
}

export function serverError(
  res: Response,
  message = ReasonPhrases.INTERNAL_SERVER_ERROR as string,
) {
  return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, message);
}

export function badRequest(
  res: Response,
  message = ReasonPhrases.BAD_REQUEST as string,
) {
  return sendError(res, StatusCodes.BAD_REQUEST, message);
}

export function unauthorized(
  res: Response,
  message = ReasonPhrases.UNAUTHORIZED as string,
) {
  return sendError(res, StatusCodes.UNAUTHORIZED, message);
}

export function forbidden(
  res: Response,
  message = ReasonPhrases.FORBIDDEN as string,
) {
  return sendError(res, StatusCodes.FORBIDDEN, message);
}

export function notFound(
  res: Response,
  message = ReasonPhrases.NOT_FOUND as string,
) {
  return sendError(res, StatusCodes.NOT_FOUND, message);
}

export function conflict(
  res: Response,
  message = ReasonPhrases.CONFLICT as string,
) {
  return sendError(res, StatusCodes.CONFLICT, message);
}

function sendError(res: Response, code: number, message: string) {
  return res.status(code).json({ code, message });
}
