/* ==========================================================================
 * BOOK THREAD A.12.2  auth   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/services/api/auth.ts
 *
 * Login, logout, current user.
 *
 * DATA - backend requests or types, renders no HTML.
 *
 * Uses: A.12.1 client
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { apiFetch } from "./client"; // A.12.1 client

// Login / logout / who is logged in.
// These don't use getJson/sendJson, because a 401 here is a normal answer, not an error.

export type AuthUser = {
    id: number;
    username: string;
    role: "trainer" | "trainee";
};

// Returns the user on success. Throws "INVALID_CREDENTIALS" for a wrong
// username/password, any other error means the server could not be reached.
export async function login(username: string, password: string): Promise<AuthUser> {
    const response = await apiFetch(`/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.status === 401 || response.status === 400) {
        throw new Error("INVALID_CREDENTIALS");
    }

    if (!response.ok) {
        throw new Error("Login failed");
    }

    return response.json();
}

export async function logout() {
    await apiFetch(`/logout`, { method: "POST" });
}

// Asks the server who is logged in (based on the cookie). null = nobody.
export async function getMe(): Promise<AuthUser | null> {
    const response = await apiFetch(`/me`);

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to get current user");
    }

    return response.json();
}

// → Next in the book: A.12.3 rooms  (src/services/api/rooms.ts)
