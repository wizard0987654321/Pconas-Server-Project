// Authentication (who are you?) and authorization (what are you allowed to do?).
//
// Flow:
// 1. POST /login checks username + password HERE on the server and, if correct,
//    puts a signed JWT into an httpOnly cookie. The browser stores that cookie
//    and sends it automatically with every request (fetch needs credentials: "include").
//    httpOnly = JavaScript in the page cannot read or change it.
// 2. requireAuth runs before every protected route, verifies the cookie's signature
//    and puts the user into req.user. A missing/invalid/expired token means 401.
// 3. requireRole("trainer") additionally checks the role from the token -> 403 if wrong.
//
// The role inside the token cannot be edited by the user: the token is signed with
// JWT_SECRET, and any change breaks the signature.

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "./db";

export type Role = "trainer" | "trainee";

export type AuthUser = {
  id: number;
  username: string;
  role: Role;
};

// Lets TypeScript know that req.user exists (set by requireAuth)
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const COOKIE_NAME = "token";
const SESSION_HOURS = 8;

// Read lazily: index.ts calls dotenv.config() after its imports run
let fallbackSecret: string | null = null;
function getSecret(): string {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

  // Without a fixed secret, a random one is generated, so it still works,
  // but every backend restart logs everybody out.
  if (!fallbackSecret) {
    console.warn("JWT_SECRET is not set in backend/.env - using a temporary random secret");
    fallbackSecret = crypto.randomBytes(32).toString("hex");
  }
  return fallbackSecret;
}

const isBcryptHash = (value: string) => /^\$2[aby]\$\d{2}\$/.test(value);

function setAuthCookie(res: Response, user: AuthUser) {
  const token = jwt.sign(user, getSecret(), { expiresIn: `${SESSION_HOURS}h` });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax", // localhost:5173 and localhost:5000 count as the same site, ports are ignored
    secure: process.env.NODE_ENV === "production", // https only once deployed
    maxAge: SESSION_HOURS * 60 * 60 * 1000,
  });
}

// POST /login  body: { username, password }
export async function login(req: Request, res: Response) {
  const { username, password } = req.body ?? {};

  if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  try {
    const dbUser = await prisma.users.findUnique({ where: { Username: username } });

    let passwordOk = false;

    if (dbUser) {
      if (isBcryptHash(dbUser.Password)) {
        passwordOk = await bcrypt.compare(password, dbUser.Password);
      } else {
        // Old plaintext password from before hashing was introduced.
        // Compare it once, then replace it with a hash (lazy migration),
        // so after each user logs in once, no plaintext passwords remain.
        passwordOk = dbUser.Password === password;
        if (passwordOk) {
          await prisma.users.update({
            where: { Id: dbUser.Id },
            data: { Password: await bcrypt.hash(password, 10) },
          });
        }
      }
    }

    // Same message for "unknown user" and "wrong password", so nobody can find out which usernames exist
    if (!dbUser || !passwordOk) {
      res.status(401).json({ error: "Invalid username or password." });
      return;
    }

    const role = dbUser.Role.toLowerCase();
    if (role !== "trainer" && role !== "trainee") {
      res.status(403).json({ error: "User has an unknown role" });
      return;
    }

    const user: AuthUser = { id: dbUser.Id, username: dbUser.Username, role };
    setAuthCookie(res, user);
    res.json(user);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
}

// POST /logout - the cookie is httpOnly, so only the server can delete it
export function logout(req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  res.json({ message: "Logged out" });
}

// GET /me - the frontend asks this on page load: "who am I logged in as?"
export function me(req: Request, res: Response) {
  res.json(req.user);
}

// Middleware: only lets the request through with a valid token
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }

  try {
    const payload = jwt.verify(token, getSecret()) as AuthUser;
    req.user = { id: payload.id, username: payload.username, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: "Session expired or invalid" });
  }
}

// Middleware factory: requireRole("trainer") -> only trainers get through
export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Not allowed for your role" });
      return;
    }
    next();
  };
}
