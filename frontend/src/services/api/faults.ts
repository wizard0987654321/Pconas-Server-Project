import type { Fault } from "../../types";
import { getJson } from "./client";

// Faults caused by the trainer (damaged equipment / cables)

// Active faults of all rooms
export function getFaultsData() {
    return getJson<Fault[]>(`/faults`, "Failed to get faults");
}
