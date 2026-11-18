/* ==========================================================================
 * BOOK THREAD A.12.8  quiz   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/services/api/quiz.ts
 *
 * Quiz questions and answers requests.
 *
 * DATA - backend requests or types, renders no HTML.
 *
 * Uses: A.12.1 client
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { getJson, sendJson } from "./client"; // A.12.1 client

// Trainer/trainee quiz: trainer activates questions, trainee answers them
// (a correct answer deactivates the question again)

export function getQuestions() {
    return getJson<any[]>(`/questions`, "Failed to get questions");
}

export function getAnswers() {
    return getJson<any[]>(`/answers`, "Failed to get answers");
}

// Trainer only, the server answers 403 for trainees
export function activateQuestions(ids: number[]) {
    return sendJson("PUT", `/activateQuestions`, { ids }, "Failed to activate questions");
}

export function deactivateQuestions(ids: number[]) {
    return sendJson("PUT", `/deactivateQuestions`, { ids }, "Failed to deactivate questions");
}

// → Next in the book: A.12.9 faults  (src/services/api/faults.ts)
