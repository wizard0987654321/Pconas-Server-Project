import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getUsers } from "../services/api";

type UserRecord = Record<string, unknown>;

type AuthUser = {
  username: string;
  role: string;
  raw: UserRecord;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoggingIn: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AUTH_STORAGE_KEY = "pconas-auth-user";
const SESSION_DURATION_MS = 60 * 60 * 1000;
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type StoredAuthSession = {
  user: AuthUser;
  expiresAt: number;
};

function readString(record: UserRecord, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function getRoleLabel(record: UserRecord): string {
  const roleValue = readString(record, ["Role"]);

  return roleValue ?? "";
}

function normalizeUser(record: UserRecord): AuthUser | null {
  const username = readString(record, ["Username"]);
  const role = getRoleLabel(record);

  if (!username || !role) {
    return null;
  }

  return {
    username,
    role,
    raw: record,
  };
}

function loadStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(storedUser) as StoredAuthSession;

    if (!parsedSession || typeof parsedSession !== "object") {
      return null;
    }

    if (typeof parsedSession.expiresAt !== "number" || Date.now() > parsedSession.expiresAt) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    const normalizedUser = normalizeUser(parsedSession.user.raw);
    return normalizedUser ?? parsedSession.user;
  } catch {
    return null;
  }
}

function saveStoredUser(user: AuthUser) {
  const session: StoredAuthSession = {
    user,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function getDisplayLabel(user: AuthUser | null): string {
  if (!user) {
    return "";
  }

  return user.role || user.username;
}

export function isTrainerUser(user: AuthUser | null): boolean {
  if (!user) {
    return false;
  }

  return user.role.trim().toLowerCase() === "trainer";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadStoredUser());
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      saveStoredUser(user);
      return;
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [user]);

  const login = async (username: string, password: string) => {
    setIsLoggingIn(true);
    setError(null);

    try {
      const users = await getUsers();
      const candidates = Array.isArray(users) ? users : [];

      const matchedRecord = candidates.find((candidate) => {
        const normalizedCandidate = candidate as UserRecord;
        const candidateUsername = readString(normalizedCandidate, ["Username"]);
        const candidatePassword = readString(normalizedCandidate, ["Password"]);

        if (!candidateUsername || !candidatePassword) {
          return false;
        }

        return candidateUsername === username && candidatePassword === password;
      }) as UserRecord | undefined;

      const nextUser = matchedRecord ? normalizeUser(matchedRecord) : null;

      if (!nextUser) {
        setUser(null);
        setError("Invalid username or password.");
        return false;
      }

      setUser(nextUser);
      return true;
    } catch {
      setError("Could not load users from the server.");
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  const value = useMemo(
    () => ({ user, isLoggingIn, error, login, logout }),
    [user, isLoggingIn, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}