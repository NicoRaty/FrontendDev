import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as db from "../db";
import {
  ErrorMessages,
  serverError,
  badRequest,
  unauthorized,
} from "../utils/errors";
import express from "express";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  if (!req.body) {
    badRequest(res);
    return;
  }
  const { name, password } = req.body;

  if (!name || !password) {
    return badRequest(res);
  }

  try {
    const user = await db.getUserByName(name);
    if (!user) {
      return unauthorized(res, ErrorMessages.INVALID_CREDENTIALS);
    }

    if (user.Password && (await bcrypt.compare(password, user.Password))) {
      delete user.Password;
      user.Token = jwt.sign({ id: user.ID }, process.env.SECRET as string);
      return res.json(user);
    } else {
      return unauthorized(res, ErrorMessages.INVALID_CREDENTIALS);
    }
  } catch (error) {
    console.error("Database error:", error);
    return serverError(res);
  }
});

export default router;
