// All backend requests, grouped by topic (same topics as backend/src/routes).
// Components keep importing from "services/api", this file collects everything.

export { apiFetch, UNAUTHORIZED_EVENT } from "./client";
export * from "./auth";
export * from "./rooms";
export * from "./equipment";
export * from "./connections";
export * from "./devices";
export * from "./services";
export * from "./quiz";
export * from "./faults";
export * from "./network";
