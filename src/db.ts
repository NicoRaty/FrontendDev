import * as maria from "mariadb";
import "dotenv/config";
import { Place, User, OkPacket } from "./types";

export async function getAllPlaces() {
  const sql = "SELECT * FROM `places`";
  return await sendQuery<Place[]>(sql);
}

export async function getPlaceById(id: number): Promise<Place> {
  const sql = "SELECT * FROM `places` where `ID` = ?";
  return (await sendQuery<Place[]>(sql, [id]))[0];
}

export async function addPlace(
  name: string,
  userId: number,
  latitude: number,
  longitude: number,
): Promise<OkPacket> {
  const sql =
    "INSERT INTO `places` (Name, UserID, Latitude, Longitude) VALUES (?, ?, ?, ?)";
  return await sendQuery<OkPacket>(sql, [name, userId, latitude, longitude]);
}

export async function editPlace(
  id: number,
  name: string,
  userId: number,
  latitude: number,
  longitude: number,
) {
  const sql =
    "UPDATE `places` SET Name = ?, UserID = ?, Latitude = ?, Longitude = ? WHERE ID = ?";
  return await sendQuery(sql, [name, userId, latitude, longitude, id]);
}

export async function deletePlace(id: number) {
  const sql = "DELETE FROM `places` WHERE `ID` = ?";
  return await sendQuery<Place>(sql, [id]);
}

export async function getPlacesByUserId(userId: any): Promise<Place[]> {
  const sql = "SELECT * FROM `places` where `UserID` = ?";
  return await sendQuery<Place[]>(sql, [userId]);
}

export async function getPlacesByUserName(name: string): Promise<Place[]> {
  const sql =
    "SELECT * FROM `places` where `UserID` = (SELECT `ID` FROM `users` WHERE `Name` = ?)";
  return await sendQuery<Place[]>(sql, [name]);
}

export async function getPlaceWithinDistance(
  latitude: number,
  longitude: number,
  distance: number,
) {
  const sql = `
    SELECT *,
    (6371 * acos(cos(radians(?)) * cos(radians(Latitude)) * cos(radians(Longitude) - radians(?)) + 
    sin(radians(?)) * sin(radians(Latitude)))) AS distance 
    FROM places
    HAVING distance < ${distance}
    `;
  return await sendQuery<Place>(sql, [latitude, longitude, latitude]);
}

export async function getAllUsers(): Promise<User[]> {
  const sql = "SELECT * FROM `users`";
  return await sendQuery<User[]>(sql);
}

export async function getUserById(id: any): Promise<User> {
  const sql = "SELECT * FROM `users` where `ID` = ?";
  return (await sendQuery<User[]>(sql, [id]))[0];
}

export async function getUserByName(name: any): Promise<User> {
  const sql = "SELECT * FROM `users` where `Name` = ?";
  return (await sendQuery<User[]>(sql, [name]))[0];
}

export async function addUser(name: string, password: string) {
  const sql = "INSERT INTO `users` (`Name`, `Password`) VALUES (?, ?)";
  return await sendQuery<User>(sql, [name, password]);
}

let pool: maria.Pool | undefined;

export function getPool(): maria.Pool {
  if (!pool) {
    pool = maria.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 100,
    });
  }
  return pool;
}

async function sendQuery<T>(sql: string, params?: any[]): Promise<T[]> {
  let connection: maria.PoolConnection | null = null;

  try {
    connection = await getPool().getConnection();

    return await connection.query(sql, params);
  } catch (err) {
    console.error("Database query failed:", err);
    throw err;
  } finally {
    connection?.release();
  }
}
