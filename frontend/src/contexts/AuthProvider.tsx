import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getUsers } from "../services/api";

type AuthUser = {
    username: string;
    role: "trainer" | "trainee";
};

type AuthContextType = {
    user: AuthUser | null;
    isLoggingIn: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isTrainer: boolean;
    isTrainee: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        const stored = localStorage.getItem("user");

        return stored ? JSON.parse(stored) : null;
    });

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);


    const login = async (username: string, password: string) => {
        setIsLoggingIn(true);
        setError(null);

        try {
            const users = await getUsers();

            const foundUser = users.find(
                (u: any) =>
                    u.Username === username &&
                    u.Password === password
            );

            if (!foundUser) {
                setError("Invalid username or password.");
                return false;
            }


            const loggedUser: AuthUser = {
                username: foundUser.Username,
                role: foundUser.Role,
            };

            setUser(loggedUser);

            return true;

        } catch {
            setError("Could not connect to server.");
            return false;

        } finally {
            setIsLoggingIn(false);
        }
    };


    const logout = () => {
        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
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