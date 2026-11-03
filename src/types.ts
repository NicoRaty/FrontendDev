import "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: number; // used for authenticated user ID
  }
}

export type User = {
  ID: number;
  Name: string;
  Password?: string;
  Token?: string;
};

export type Place = {
  ID?: number;
  Name: string;
  UserID: number;
  Latitude: number;
  Longitude: number;
};

export type OkPacket = {
  // for insert/update/delete MySQL operations
  affectedRows: number;
  insertId: number;
  warningStatus: number;
};
