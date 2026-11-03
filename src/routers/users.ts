import * as db from "../db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { serverError, badRequest, conflict } from "../utils/errors";
import express from "express";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const users = await db.getAllUsers();

    users.forEach((user) => delete user.Password);

    return res.json(users);
  } catch (error) {
    console.error("Database error:", error);
    return serverError(res);
  }
});

router.post("/", async (req: Request, res: Response) => {
  if (!req.body || !req.body.name || !req.body.password) {
    badRequest(res);
    return;
  }

  req.body.password = await bcrypt.hash(req.body.password, 12);

  const { name, password } = req.body;
  try {
    const existingUser = await db.getUserByName(name);
    if (existingUser) {
      conflict(res);
      return;
    }
    await db.addUser(name, password);
    const user = await db.getUserByName(name);
    delete user?.Password;
    return res.json(user);
  } catch (error) {
    console.error("Database error:", error);
    return serverError(res);
  }
});

export default router;
