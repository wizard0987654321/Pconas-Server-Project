import { getJson, sendJson } from "./client";

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
