/* ==========================================================================
 * BOOK THREAD 2.5.1.1  usePolling   (Chapter 2: Rooms)
 * File: src/helpers/hooks/usePolling.ts
 *
 * Runs a function at once and then every few seconds. keepIfUnchanged avoids re-renders when the reloaded
 * data is the same.
 *
 * HOOK - only provides data / functions to the component that calls it, renders no HTML.
 *
 * Used by: 2.5.1 useRoomData
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useEffect, useRef } from "react";

// Calls `callback` once right away and then every `intervalMs` milliseconds,
// until the component is removed (e.g. the user leaves the page).
// Used for live sync: the browser keeps asking the backend for new data.
export function usePolling(callback: () => void, intervalMs: number) {
    // Always call the newest callback, without restarting the timer on every render
    const callbackRef = useRef(callback);
    useEffect(() => {
        callbackRef.current = callback;
    });

    useEffect(() => {
        callbackRef.current();
        const timer = setInterval(() => callbackRef.current(), intervalMs);
        return () => clearInterval(timer);
    }, [intervalMs]);
}

// For state setters: keeps the old value when the new data is the same,
// so React doesn't re-render (and recalculate lines / power) after every poll.
// Usage: setData(keepIfUnchanged(newData))
export function keepIfUnchanged<T>(next: T) {
    return (prev: T) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next);
}

// → Next in the book: 2.5.2 usePowerFlow  (src/helpers/hooks/usePowerFlow.ts)
