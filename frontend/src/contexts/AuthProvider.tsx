import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
    getMe,
    login as apiLogin,
    logout as apiLogout,
    UNAUTHORIZED_EVENT,
    type AuthUser,
} from "../services/api";

// The server is the source of truth for who is logged in (httpOnly cookie).
// This context only mirrors that answer, so components can decide what to SHOW.
// What a user is ALLOWED to do is checked by the backend on every request.

type AuthContextType = {
    user: AuthUser | null;
    isCheckingSession: boolean;
    isLoggingIn: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isTrainer: boolean;
    isTrainee: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);

    // true until the server answered "who am I?" on page load,
    // prevents the login screen from flashing for an already logged-in user
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // On page load / reload: ask the server whether the cookie is still a valid login
    useEffect(() => {
        getMe()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setIsCheckingSession(false));
    }, []);


    // Any request answered with 401 (e.g. token expired after 8h) -> back to login screen
    useEffect(() => {
        const handleUnauthorized = () => setUser(null);

        window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
        return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    }, []);


    const login = async (username: string, password: string) => {
        setIsLoggingIn(true);
        setError(null);

        try {
            // The password is checked on the server, the browser never sees other users
            const loggedUser = await apiLogin(username, password);
            setUser(loggedUser);
            return true;

        } catch (err) {
            setError(
                err instanceof Error && err.message === "INVALID_CREDENTIALS"
                    ? "Invalid username or password."
                    : "Could not connect to server."
            );
            return false;

        } finally {
            setIsLoggingIn(false);
        }
    };


    const logout = () => {
        // The cookie is httpOnly, so only the server can delete it.
        // The UI logs out immediately, even if the request fails.
        apiLogout().catch(() => undefined);
        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                isCheckingSession,
                isLoggingIn,
                error,
                login,
                logout,
                isTrainer: user?.role === "trainer",
                isTrainee: user?.role === "trainee",
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
