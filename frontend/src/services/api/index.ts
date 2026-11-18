/* ==========================================================================
 * BOOK THREAD A.12  api   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/services/api/index.ts
 *
 * All backend calls in one import (`from "services/api"`). Re-exports the files A.12.1 - A.12.9.
 *
 * DATA - backend requests or types, renders no HTML.
 *
 * Used by: 0.3 AuthProvider, 2.2 ServerRoom, 2.3.1 ActivateQuestionOverlay, 2.3.2 AnswerQuestionsOverlay,
 *   2.5.1 useRoomData, 2.5.11 OutsideEquipmentInfoOverlay, 2.5.12 CableChangeOverlay, 2.5.13 TrainerPanel,
 *   2.6 DetailedRack, A.7 AddOverlay, A.8 EditOverlay, A.10.1 roomOperations, A.10.2 rackOperations,
 *   A.10.3 deviceTypeOperations, A.10.4 deviceOperations, A.10.5 vmOperations, A.10.6 serviceOperations,
 *   A.10.7 customerOperations
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

// All backend requests, grouped by topic (same topics as backend/src/routes).
// Components keep importing from "services/api", this file collects everything.

export { apiFetch, UNAUTHORIZED_EVENT } from "./client"; // A.12.1 client
export * from "./auth"; // A.12.2 auth
export * from "./rooms"; // A.12.3 rooms
export * from "./equipment"; // A.12.4 equipment
export * from "./connections"; // A.12.5 connections
export * from "./devices"; // A.12.6 devices
export * from "./services"; // A.12.7 services
export * from "./quiz"; // A.12.8 quiz
export * from "./faults"; // A.12.9 faults

// → Next in the book: A.12.1 client  (src/services/api/client.ts)
