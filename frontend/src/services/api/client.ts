/* ==========================================================================
 * BOOK THREAD A.12.1  client   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/services/api/client.ts
 *
 * apiFetch / getJson / sendJson: every request goes through here (login cookie, error messages, 401
 * handling).
 *
 * DATA - backend requests or types, renders no HTML.
 *
 * Used by: A.12.2 auth, A.12.3 rooms, A.12.4 equipment, A.12.5 connections, A.12.6 devices, A.12.7 services,
 *   A.12.8 quiz, A.12.9 faults
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

// Low-level communication with the backend, used by all the topic files in this folder

// variable url, so when it is hosted i can just change this url
const API_URL = import.meta.env.VITE_API_URL;

// AuthProvider listens for this event and logs the user out in the UI
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

// Every request to the backend goes through here.
// credentials: "include" makes the browser send the httpOnly login cookie along
// (by default fetch does not send cookies to another origin, 5173 -> 5000).
// A 401 means the session expired / is invalid, so the UI is told to log out.
export async function apiFetch(path: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: "include",
    });

    // /me and /login answer 401 as a normal "not logged in" / "wrong password", no event for those
    if (response.status === 401 && path !== "/me" && path !== "/login") {
        window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

    return response;
}

// Throws on a failed response. Uses the backend's { error: "..." } message when there is one,
// otherwise the given fallback message.
async function throwIfFailed(response: Response, fallbackMessage: string) {
    if (response.ok) return;

    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? fallbackMessage);
}

// GET request, returns the parsed JSON
export async function getJson<T>(path: string, errorMessage: string): Promise<T> {
    const response = await apiFetch(path);
    await throwIfFailed(response, errorMessage);
    return response.json();
}

// POST / PUT / DELETE request, `body` is sent as JSON (if given), returns the parsed JSON answer
export async function sendJson<T = unknown>(
    method: "POST" | "PUT" | "DELETE",
    path: string,
    body: unknown,
    errorMessage: string
): Promise<T> {
    const response = await apiFetch(path, {
        method,
        ...(body !== undefined && {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }),
    });
    await throwIfFailed(response, errorMessage);
    return response.json();
}

// → Next in the book: A.12.2 auth  (src/services/api/auth.ts)
