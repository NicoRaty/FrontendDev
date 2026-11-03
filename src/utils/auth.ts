import { Request, Response, NextFunction } from "express";
import { ErrorMessages, unauthorized } from "./errors";
import jwt from "jsonwebtoken";

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
   const auth = req.get("authorization");
   if (!auth?.startsWith("Bearer ")) {
      return unauthorized(res, ErrorMessages.MISSING_TOKEN);
   }

   const token = auth.split(" ")[1];

   try {
      const decoded = jwt.verify(token, process.env.SECRET as string);
      if (
         typeof decoded === "string" ||
         typeof decoded.id !== "number" ||
         !Number.isInteger(decoded.id)
      ) {
         return unauthorized(res, "Invalid token");
      }
      req.userId = decoded.id;
      return next();
   } catch (err) {
      console.error("JWT verification error:", err);
      return unauthorized(res, "Invalid token");
   }
}