import * as db from "../db";
import { Place } from "../types";
import { authenticateUser } from "../utils/auth";
import {
  ErrorMessages,
  serverError,
  badRequest,
  notFound,
  forbidden,
} from "../utils/errors";
import { Request, Response } from "express";
import express from "express";
import { validateCoordinates } from "../utils/validation";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const places: Place[] = await db.getAllPlaces();
    return res.json(places);
  } catch (error) {
    console.log("Database error:", error);
    return serverError(res);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || !Number.isInteger(id)) {
    return badRequest(res, ErrorMessages.INVALID_PLACE_ID);
  }

  try {
    const place = await db.getPlaceById(id);

    if (!place) {
      return notFound(res, ErrorMessages.PLACE_NOT_FOUND);
    }

    return res.json(place);
  } catch (error) {
    console.log("Database error:", error);
    return serverError(res);
  }
});

router.post("/", authenticateUser, async (req: Request, res: Response) => {
  const { Name, Latitude, Longitude, UserID } = req.body;

  if (!validatePlaceBody(req.body, res)) {
    return;
  }

  if (UserID !== req.userId) {
    // comes from auth middleware
    return forbidden(res);
  }

  try {
    const status = await db.addPlace(Name, UserID, Latitude, Longitude);
    const addedPlace = await db.getPlaceById(Number(status.insertId));
    return res.status(201).json(addedPlace);
  } catch (error) {
    console.log("Database error:", error);
    return serverError(res);
  }
});

router.put("/:id", authenticateUser, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { Name, Latitude, Longitude, UserID } = req.body;

  if (!id || !Number.isInteger(id)) {
    return badRequest(res, ErrorMessages.INVALID_PLACE_ID);
  }

  if (!validatePlaceBody(req.body, res)) {
    return;
  }

  if (UserID !== req.userId) {
    // comes from auth middleware
    return forbidden(res);
  }

  try {
    const existingPlace = await db.getPlaceById(id);

    if (!existingPlace) {
      return notFound(res, ErrorMessages.PLACE_NOT_FOUND);
    }

    if (existingPlace.UserID !== UserID) {
      return forbidden(res);
    }

    await db.editPlace(id, Name, UserID, Latitude, Longitude);

    const updatedPlace = await db.getPlaceById(id);
    return res.json(updatedPlace);
  } catch (error) {
    console.log("Database error:", error);
    return serverError(res);
  }
});

router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = req.userId!;

  if (!id || !Number.isInteger(id)) {
    return badRequest(res, ErrorMessages.INVALID_PLACE_ID);
  }

  try {
    const place = await db.getPlaceById(id);

    if (!place) {
      return notFound(res, ErrorMessages.PLACE_NOT_FOUND);
    }

    if (place.UserID !== userId) {
      // comes from auth middleware
      return forbidden(res);
    }

    await db.deletePlace(id);

    return res.json(place);
  } catch (error) {
    console.log("Database error:", error);
    return serverError(res);
  }
});

function validatePlaceBody(body: any, res: Response): boolean {
  const { Name, Latitude, Longitude, UserID } = body;

  if (
    !Name ||
    !UserID ||
    !Number.isInteger(UserID) ||
    Latitude == null ||
    Longitude == null
  ) {
    badRequest(res, ErrorMessages.MISSING_OR_INVALID_FIELDS);
    return false;
  }

  if (!validateCoordinates(Latitude, Longitude)) {
    badRequest(res, ErrorMessages.INVALID_COORDINATES);
    return false;
  }

  return true;
}

export default router;
